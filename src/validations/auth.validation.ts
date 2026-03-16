/** Schema to validate user registration. */
export const registerSchema = {
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
            enum: ['ADMIN', 'MANAGER', 'STAFF'],
            default: 'STAFF'
        },
        permission_ids: {
            type: 'array',
            items: { type: 'string', format: 'uuid' }
        }
    },
    required: ['name', 'email', 'password', 'role'],
    additionalProperties: false,
};

/** Schema to validate user login. */
export const loginSchema = {
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
export const forgotPasswordSchema = {
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
export const changePasswordSchema = {
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
