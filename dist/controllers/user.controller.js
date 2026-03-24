"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const user_service_1 = __importDefault(require("../services/user.service"));
const user_permission_service_1 = __importDefault(require("../services/user-permission.service"));
const media_service_1 = __importDefault(require("../services/media.service"));
const file_service_1 = require("../utils/file-service");
const http_status_1 = require("../utils/http-status");
const permission_helper_1 = require("../utils/permission-helper");
/** GET API: Get all users */
const getAllUsers = async (req, res, next) => {
    try {
        const { search, role } = req.query;
        const users = await user_service_1.default.getAllUsers(search, role);
        if (!users.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No users found.', users);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Users fetched successfully.', users);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch users.', error);
        next(error);
    }
};
/** GET API: Get all users with pagination */
const getAllUsersPaginated = async (req, res, next) => {
    try {
        const { page, limit, search, role } = req.query;
        const paginatedUsers = await user_service_1.default.getAllUsersPaginated(page, limit, search, role);
        if (!paginatedUsers.users.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No users found.', paginatedUsers);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Users fetched successfully.', paginatedUsers);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch users.', error);
        next(error);
    }
};
/** GET API: Get user by ID */
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_service_1.default.findUserById(id);
        if (!user) {
            return (0, http_status_1.sendNotFoundResponse)(res, 'User not found.');
        }
        (0, http_status_1.sendSuccessResponse)(res, 'User fetched successfully.', user);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch user.', error);
        next(error);
    }
};
/** GET API: Get current user profile */
const getCurrentUser = async (req, res, next) => {
    try {
        const { user } = res.locals.auth;
        (0, http_status_1.sendSuccessResponse)(res, 'User profile fetched successfully.', user);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch user profile.', error);
        next(error);
    }
};
/** PUT API: Update user profile */
const updateUserProfile = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { name, email } = req.body;
        const { user_id } = res.locals.auth;
        // Check if user exists
        const existingUser = await user_service_1.default.findUserById(user_id);
        if (!existingUser) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found.');
        }
        // Check if email already exists
        if (email) {
            const emailExists = await user_service_1.default.findUserByEmail(email, user_id);
            if (emailExists) {
                await transaction.rollback();
                return (0, http_status_1.sendBadRequestResponse)(res, 'User with same email already already exists.', null);
            }
        }
        // If a new profile picture is uploaded, delete the old one from disk
        if (req.file) {
            await media_service_1.default.saveUserProfilePicture(user_id, req.file, transaction);
        }
        // Prepare update data
        const updateData = {
            name,
            email,
        };
        // Update user
        const updatedRowsCount = await user_service_1.default.updateUser(user_id, updateData, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found or no changes made.');
        }
        // Get updated user
        const updatedUser = await user_service_1.default.findUserById(user_id, transaction);
        if (!updatedUser) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'User profile updated successfully.', updatedUser);
    }
    catch (error) {
        // Clean up uploaded file if operation fails
        if (req.file) {
            (0, file_service_1.removeMediaFile)(`media/profiles/${req.file.filename}`);
        }
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update user profile.', error);
        next(error);
    }
};
/** POST API: Admin create user (with permissions) */
const createUser = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { name, email, password, role, permission_ids } = req.body;
        const existingUser = await user_service_1.default.findUserByEmail(email);
        if (existingUser) {
            await transaction.rollback();
            return (0, http_status_1.sendConflictErrorResponse)(res, 'User with this email already exists!');
        }
        const userData = { name, email, password, role };
        const user = await user_service_1.default.createUser(userData, transaction);
        if (!user) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create user.');
        }
        const permissionIdsToAssign = Array.isArray(permission_ids)
            ? permission_ids
            : (0, permission_helper_1.getDefaultPermissionIdsForRole)(role);
        await user_permission_service_1.default.upsertUserPermissions(user.id, permissionIdsToAssign, transaction);
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'User created successfully.', user);
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create user.', error);
        next(error);
    }
};
/** PUT API: Admin update user (and permissions based on role) */
const updateUser = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, email, role, permission_ids } = req.body;
        const existingUser = await user_service_1.default.findUserById(id);
        if (!existingUser) {
            await transaction.rollback();
            return (0, http_status_1.sendNotFoundResponse)(res, 'User not found.');
        }
        if (email) {
            const emailExists = await user_service_1.default.findUserByEmail(email, id);
            if (emailExists) {
                await transaction.rollback();
                return (0, http_status_1.sendConflictErrorResponse)(res, 'User with this email already exists!');
            }
        }
        const updatedRowsCount = await user_service_1.default.updateUser(id, { name, email, role }, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found or no changes made.');
        }
        const permissionIdsToAssign = Array.isArray(permission_ids)
            ? permission_ids
            : (0, permission_helper_1.getDefaultPermissionIdsForRole)(role);
        await user_permission_service_1.default.upsertUserPermissions(id, permissionIdsToAssign, transaction);
        const updatedUser = await user_service_1.default.findUserById(id, transaction);
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'User updated successfully.', updatedUser);
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update user.', error);
        next(error);
    }
};
/** DELETE API: Delete user */
const deleteUser = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { role, user_id } = res.locals.auth;
        // TODO: remove this after adding role base middleware 
        if (role.toLowerCase() !== 'admin') {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'You are not authorized to delete this user.');
        }
        // Check if user is the same as the current user
        if (id === user_id) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'You cannot delete yourself.');
        }
        // Check if user exists
        const existingUser = await user_service_1.default.findUserById(id);
        if (!existingUser) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found.');
        }
        // Delete user
        const updatedRowsCount = await user_service_1.default.deleteUser(id, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found or already deleted.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'User deleted successfully.');
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to delete user.', error);
        next(error);
    }
};
exports.default = {
    getAllUsers,
    getAllUsersPaginated,
    getUserById,
    getCurrentUser,
    updateUserProfile,
    createUser,
    updateUser,
    deleteUser
};
