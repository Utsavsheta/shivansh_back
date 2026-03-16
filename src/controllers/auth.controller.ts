import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { sequelize } from '../server';
import userService from '../services/user.service';
import userPermissionService from '../services/user-permission.service';
import cryptoHelper from '../utils/crypto-helper';
import helperFunctions from '../utils/helper';
import { sendBadRequestResponse, sendConflictErrorResponse, sendSuccessResponse } from '../utils/http-status';
import { sendForgotPasswordMail } from '../utils/mail-helper';
import { CreateUserData } from '../interfaces/user.interfaces';
import { getDefaultPermissionIdsForRole } from '../utils/permission-helper';

/** POST API: Register a new user */
const register = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { name, email, password, role, permission_ids } = req.body;

        // Check if user already exists
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            await transaction.rollback();
            return sendConflictErrorResponse(res, 'User with this email already exists!');
        }

        // Prepare user data
        const userData: CreateUserData = {
            name,
            email,
            password,
            role
        };

        // Create user
        const user = await userService.createUser(userData, transaction);
        if(!user) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Failed to register user.');
        }

        const permissionIdsToAssign: string[] = Array.isArray(permission_ids)
            ? permission_ids
            : getDefaultPermissionIdsForRole(role);

        await userPermissionService.upsertUserPermissions(user.id, permissionIdsToAssign, transaction);

        // Generate JWT token
        const token = cryptoHelper.encrypt({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
        });

        await transaction.commit();
        sendSuccessResponse(res, 'User registered successfully.', { user, token });
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to register user.', error);
        next(error);
    }
};

/** POST API: Login user */
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return sendBadRequestResponse(res, 'Invalid email or password.');
        }

        // Verify password
        const isPasswordValid = await cryptoHelper.compareAsync(password, user.password);
        if (!isPasswordValid) {
            return sendBadRequestResponse(res, 'Invalid email or password.');
        }

        // Generate JWT token
        const token = cryptoHelper.encrypt({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
        });

        sendSuccessResponse(res, 'User logged in successfully.', { user, token });
    } catch (error) {
        sendBadRequestResponse(res, 'Incorrect credentials, failed to login.', error);
        next(error);
    }
};

/** POST API: Forgot password */
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await userService.findUserByEmail(email);
        if (!user) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'User with this email does not exist.');
        }

        // Generate new random password
        const newPassword = helperFunctions.generateRandomPassword();
        
        // Hash new password
        const hashedNewPassword = await cryptoHelper.hashAsync(newPassword);
        
        // Update user password
        const isUserUpdated = await userService.updateUser(user.id, { password: hashedNewPassword }, transaction);
        if(!isUserUpdated) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Failed to update user password');
        }

        // Send email with new password
        sendForgotPasswordMail({
            name: user.name,
            email: user.email,
            password: newPassword,
            user_type: user.role
        });

        await transaction.commit();
        sendSuccessResponse(res, 'Password reset email sent.');
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to send password reset email.', error);
        next(error);
    }
};

/** POST API: Change password */
const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { currentPassword, newPassword } = req.body;
        const { user } = res.locals.auth;

        // Verify current password
        const isCurrentPasswordValid = await cryptoHelper.compareAsync(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Current password is incorrect.');
        }

        // Hash new password
        const hashedNewPassword = await cryptoHelper.hashAsync(newPassword);
        
        // Update password
        const isUserUpdated = await userService.updateUser(user.id, { password: hashedNewPassword }, transaction);
        if(!isUserUpdated) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Failed to update user password.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'Password changed successfully.');
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to change password.', error);
        next(error);
    }
};

export default {
    register,
    login,
    forgotPassword,
    changePassword,
};
