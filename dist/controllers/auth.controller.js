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
const user_permission_service_1 = __importDefault(require("../services/user-permission.service"));
const crypto_helper_1 = __importDefault(require("../utils/crypto-helper"));
const helper_1 = __importDefault(require("../utils/helper"));
const http_status_1 = require("../utils/http-status");
const mail_helper_1 = require("../utils/mail-helper");
const permission_helper_1 = require("../utils/permission-helper");
/** POST API: Register a new user */
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield server_1.sequelize.transaction();
    try {
        const { name, email, password, role, permission_ids } = req.body;
        // Check if user already exists
        const existingUser = yield user_service_1.default.findUserByEmail(email);
        if (existingUser) {
            yield transaction.rollback();
            return (0, http_status_1.sendConflictErrorResponse)(res, 'User with this email already exists!');
        }
        // Prepare user data
        const userData = {
            name,
            email,
            password,
            role
        };
        // Create user
        const user = yield user_service_1.default.createUser(userData, transaction);
        if (!user) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Failed to register user.');
        }
        const permissionIdsToAssign = Array.isArray(permission_ids)
            ? permission_ids
            : (0, permission_helper_1.getDefaultPermissionIdsForRole)(role);
        yield user_permission_service_1.default.upsertUserPermissions(user.id, permissionIdsToAssign, transaction);
        // Generate JWT token
        const token = crypto_helper_1.default.encrypt({
            id: user.id,
            email: user.email,
            role: user.role
        });
        yield transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'User registered successfully.', { user, token });
    }
    catch (error) {
        yield transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to register user.', error);
        next(error);
    }
});
/** POST API: Login user */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield user_service_1.default.findUserByEmail(email);
        if (!user) {
            return (0, http_status_1.sendBadRequestResponse)(res, 'Invalid email or password.');
        }
        // Verify password
        const isPasswordValid = yield crypto_helper_1.default.compareAsync(password, user.password);
        if (!isPasswordValid) {
            return (0, http_status_1.sendBadRequestResponse)(res, 'Invalid email or password.');
        }
        // Generate JWT token
        const token = crypto_helper_1.default.encrypt({
            id: user.id,
            email: user.email,
            role: user.role
        });
        (0, http_status_1.sendSuccessResponse)(res, 'User logged in successfully.', { user, token });
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Incorrect credentials, failed to login.', error);
        next(error);
    }
});
/** POST API: Forgot password */
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield server_1.sequelize.transaction();
    try {
        const { email } = req.body;
        // Check if user exists
        const user = yield user_service_1.default.findUserByEmail(email);
        if (!user) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'User with this email does not exist.');
        }
        // Generate new random password
        const newPassword = helper_1.default.generateRandomPassword();
        // Hash new password
        const hashedNewPassword = yield crypto_helper_1.default.hashAsync(newPassword);
        // Update user password
        const isUserUpdated = yield user_service_1.default.updateUser(user.id, { password: hashedNewPassword }, transaction);
        if (!isUserUpdated) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update user password');
        }
        // Send email with new password
        (0, mail_helper_1.sendForgotPasswordMail)({
            name: user.name,
            email: user.email,
            password: newPassword,
            user_type: user.role
        });
        yield transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Password reset email sent.');
    }
    catch (error) {
        yield transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to send password reset email.', error);
        next(error);
    }
});
/** POST API: Change password */
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield server_1.sequelize.transaction();
    try {
        const { currentPassword, newPassword } = req.body;
        const { user } = res.locals.auth;
        // Verify current password
        const isCurrentPasswordValid = yield crypto_helper_1.default.compareAsync(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Current password is incorrect.');
        }
        // Hash new password
        const hashedNewPassword = yield crypto_helper_1.default.hashAsync(newPassword);
        // Update password
        const isUserUpdated = yield user_service_1.default.updateUser(user.id, { password: hashedNewPassword }, transaction);
        if (!isUserUpdated) {
            yield transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update user password.');
        }
        yield transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Password changed successfully.');
    }
    catch (error) {
        yield transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to change password.', error);
        next(error);
    }
});
exports.default = {
    register,
    login,
    forgotPassword,
    changePassword,
};
