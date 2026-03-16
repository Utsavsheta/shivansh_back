"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const user_service_1 = __importDefault(require("../services/user.service"));
const media_service_1 = __importDefault(require("../services/media.service"));
const file_service_1 = require("../utils/file-service");
const http_status_1 = require("../utils/http-status");
/** GET API: Get all users */
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, role } = req.query;
        const users = yield user_service_1.default.getAllUsers(search, role);
        if (!users.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No users found.', users);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Users fetched successfully.', users);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch users.', error);
        next(error);
    }
});
/** GET API: Get all users with pagination */
const getAllUsersPaginated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, search, role } = req.query;
        const paginatedUsers = yield user_service_1.default.getAllUsersPaginated(page, limit, search, role);
        if (!paginatedUsers.users.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No users found.', paginatedUsers);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Users fetched successfully.', paginatedUsers);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch users.', error);
        next(error);
    }
});
/** GET API: Get user by ID */
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_service_1.default.findUserById(id);
        if (!user) {
            return (0, http_status_1.sendNotFoundResponse)(res, 'User not found.');
        }
        (0, http_status_1.sendSuccessResponse)(res, 'User fetched successfully.', user);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch user.', error);
        next(error);
    }
});
/** GET API: Get current user profile */
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = res.locals.auth;
        (0, http_status_1.sendSuccessResponse)(res, 'User profile fetched successfully.', user);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch user profile.', error);
        next(error);
    }
});
/** PUT API: Update user profile */
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield server_1.sequelize.transaction();
    try {
        const { name, email } = req.body;
        const { user_id } = res.locals.auth;
        // Check if user exists
        const existingUser = yield user_service_1.default.findUserById(user_id);
        if (!existingUser) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found.');
        }
        // Check if email already exists
        if (email) {
            const emailExists = yield user_service_1.default.findUserByEmail(email, user_id);
            if (emailExists) {
                yield transaction.rollback();
                return (0, http_status_1.sendBadRequestResponse)(res, 'User with same email already already exists.', null);
            }
        }
        // If a new profile picture is uploaded, delete the old one from disk
        if (req.file) {
            yield media_service_1.default.saveUserProfilePicture(user_id, req.file, transaction);
        }
        // Prepare update data
        const updateData = {
            name,
            email,
        };
        // Update user
        const updatedRowsCount = yield user_service_1.default.updateUser(user_id, updateData, transaction);
        if (updatedRowsCount === 0) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found or no changes made.');
        }
        // Get updated user
        const updatedUser = yield user_service_1.default.findUserById(user_id, transaction);
        if (!updatedUser) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found.');
        }
        yield transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'User profile updated successfully.', updatedUser);
    }
    catch (error) {
        // Clean up uploaded file if operation fails
        if (req.file) {
            (0, file_service_1.removeMediaFile)(`media/profiles/${req.file.filename}`);
        }
        yield transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update user profile.', error);
        next(error);
    }
});
/** DELETE API: Delete user */
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { role, user_id } = res.locals.auth;
        // TODO: remove this after adding role base middleware 
        if (role.toLowerCase() !== 'admin') {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'You are not authorized to delete this user.');
        }
        // Check if user is the same as the current user
        if (id === user_id) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'You cannot delete yourself.');
        }
        // Check if user exists
        const existingUser = yield user_service_1.default.findUserById(id);
        if (!existingUser) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found.');
        }
        // Delete user
        const updatedRowsCount = yield user_service_1.default.deleteUser(id, transaction);
        if (updatedRowsCount === 0) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User not found or already deleted.');
        }
        yield transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'User deleted successfully.');
    }
    catch (error) {
        yield transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to delete user.', error);
        next(error);
    }
});
exports.default = {
    getAllUsers,
    getAllUsersPaginated,
    getUserById,
    getCurrentUser,
    updateUserProfile,
    deleteUser
};
