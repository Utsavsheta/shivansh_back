"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
/** Schema to validate user registration. */
exports.registerSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 250
        },
        email: {
            type: 'string',
            format: 'email',
            maxLength: 250
        },
        password: {
            type: 'string',
            minLength: 6,
            maxLength: 100
        },
        role: {
            type: 'string',
            enum: ['ADMIN', 'USER', 'INSTRUCTOR'],
            default: 'USER'
        }
    },
    required: ['name', 'email', 'password', 'role'],
    additionalProperties: false,
};
/** Schema to validate user login. */
exports.loginSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            maxLength: 250
        },
        password: {
            type: 'string',
            minLength: 1,
            maxLength: 100
        }
    },
    required: ['email', 'password'],
    additionalProperties: false,
};
/** Schema to validate forgot password. */
exports.forgotPasswordSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            maxLength: 250
        }
    },
    required: ['email'],
    additionalProperties: false,
};
/** Schema to validate change password. */
exports.changePasswordSchema = {
    type: 'object',
    properties: {
        currentPassword: {
            type: 'string',
            minLength: 1,
            maxLength: 100
        },
        newPassword: {
            type: 'string',
            minLength: 6,
            maxLength: 100
        }
    },
    required: ['currentPassword', 'newPassword'],
    additionalProperties: false,
};
