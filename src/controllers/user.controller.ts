import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { CreateUserData, PaginatedUsers, UpdateUserData } from '../interfaces/user.interfaces';
import { sequelize } from '../server';
import userService from '../services/user.service';
import userPermissionService from '../services/user-permission.service';
import mediaService from '../services/media.service';
import { removeMediaFile } from '../utils/file-service';
import { sendBadRequestResponse, sendConflictErrorResponse, sendNotFoundResponse, sendSuccessResponse } from '../utils/http-status';
import { getDefaultPermissionIdsForRole } from '../utils/permission-helper';

/** GET API: Get all users */
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, role } = req.query;

        const users = await userService.getAllUsers(search as string, role as string);
        if (!users.length) {
            return sendSuccessResponse(res, 'No users found.', users);
        }

        sendSuccessResponse(res, 'Users fetched successfully.', users);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch users.', error);
        next(error);
    }
};

/** GET API: Get all users with pagination */
const getAllUsersPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, search, role } = req.query;

        const paginatedUsers: PaginatedUsers = await userService.getAllUsersPaginated(page as unknown as number, limit as unknown as number, search as string, role as string);
        if (!paginatedUsers.users.length) {
            return sendSuccessResponse(res, 'No users found.', paginatedUsers);
        }

        sendSuccessResponse(res, 'Users fetched successfully.', paginatedUsers);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch users.', error);
        next(error);
    }
};

/** GET API: Get user by ID */
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await userService.findUserById(id as string);
        if (!user) {
            return sendNotFoundResponse(res, 'User not found.');
        }

        sendSuccessResponse(res, 'User fetched successfully.', user);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch user.', error);
        next(error);
    }
};

/** GET API: Get current user profile */
const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user } = res.locals.auth;

        sendSuccessResponse(res, 'User profile fetched successfully.', user);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch user profile.', error);
        next(error);
    }
};

/** PUT API: Update user profile */
const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { name, email } = req.body;
        const { user_id } = res.locals.auth;

        // Check if user exists
        const existingUser = await userService.findUserById(user_id);
        if (!existingUser) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'User not found.');
        }

        // Check if email already exists
        if (email) {
            const emailExists = await userService.findUserByEmail(email, user_id);
            if (emailExists) {
                await transaction.rollback();
                return sendBadRequestResponse(res, 'User with same email already already exists.', null);
            }
        }

        // If a new profile picture is uploaded, delete the old one from disk
        if (req.file) {
            await mediaService.saveUserProfilePicture(user_id, req.file, transaction);
        }

        // Prepare update data
        const updateData: UpdateUserData = {
            name,
            email,
        };

        // Update user
        const updatedRowsCount = await userService.updateUser(user_id, updateData, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'User not found or no changes made.');
        }

        // Get updated user
        const updatedUser = await userService.findUserById(user_id, transaction);
        if (!updatedUser) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'User not found.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'User profile updated successfully.', updatedUser);
    } catch (error) {
        // Clean up uploaded file if operation fails
        if (req.file) {
            removeMediaFile(`media/profiles/${req.file.filename}`);
        }
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to update user profile.', error);
        next(error);
    }
};

/** POST API: Admin create user (with permissions) */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { name, email, password, role, permission_ids } = req.body;

        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            await transaction.rollback();
            return sendConflictErrorResponse(res, 'User with this email already exists!');
        }

        const userData: CreateUserData = { name, email, password, role };
        const user = await userService.createUser(userData, transaction);
        if (!user) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Failed to create user.');
        }

        const permissionIdsToAssign: string[] = Array.isArray(permission_ids)
            ? permission_ids
            : getDefaultPermissionIdsForRole(role);

        await userPermissionService.upsertUserPermissions(user.id, permissionIdsToAssign, transaction);

        await transaction.commit();
        sendSuccessResponse(res, 'User created successfully.', user);
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to create user.', error);
        next(error);
    }
};

/** PUT API: Admin update user (and permissions based on role) */
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, email, role, permission_ids } = req.body;

        const existingUser = await userService.findUserById(id as string);
        if (!existingUser) {
            await transaction.rollback();
            return sendNotFoundResponse(res, 'User not found.');
        }

        if (email) {
            const emailExists = await userService.findUserByEmail(email, id as string);
            if (emailExists) {
                await transaction.rollback();
                return sendConflictErrorResponse(res, 'User with this email already exists!');
            }
        }

        const updatedRowsCount = await userService.updateUser(id as string, { name, email, role }, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'User not found or no changes made.');
        }

        const permissionIdsToAssign: string[] = Array.isArray(permission_ids)
            ? permission_ids
            : getDefaultPermissionIdsForRole(role);

        await userPermissionService.upsertUserPermissions(id as string, permissionIdsToAssign, transaction);

        const updatedUser = await userService.findUserById(id as string, transaction);
        await transaction.commit();

        sendSuccessResponse(res, 'User updated successfully.', updatedUser);
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to update user.', error);
        next(error);
    }
};

/** DELETE API: Delete user */
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { role, user_id } = res.locals.auth;

        // TODO: remove this after adding role base middleware 
        if (role.toLowerCase() !== 'admin') {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'You are not authorized to delete this user.');
        }

        // Check if user is the same as the current user
        if (id === user_id) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'You cannot delete yourself.');
        }

        // Check if user exists
        const existingUser = await userService.findUserById(id as string);
        if (!existingUser) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'User not found.');
        }

        // Delete user
        const updatedRowsCount = await userService.deleteUser(id as string, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'User not found or already deleted.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'User deleted successfully.');
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to delete user.', error);
        next(error);
    }
};

export default {
    getAllUsers,
    getAllUsersPaginated,
    getUserById,
    getCurrentUser,
    updateUserProfile,
    createUser,
    updateUser,
    deleteUser
};
