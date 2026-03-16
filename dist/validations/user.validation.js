"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAdminUpdateSchema = exports.userAdminCreateSchema = exports.userUpdateProfileSchema = exports.userGetAllPaginatedSchema = exports.userGetAllSchema = void 0;
/** Schema to validate userGetAll API. */
exports.userGetAllSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        role: { type: 'string' },
    },
    additionalProperties: false,
};
/** Schema to validate userGetAllPaginated API. */
exports.userGetAllPaginatedSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        role: { type: 'string' },
        page: {
            type: 'string',
            pattern: '^[1-9][0-9]*$'
        },
        limit: {
            type: 'string',
            pattern: '^[1-9][0-9]*$'
        }
    },
    additionalProperties: false,
};
/** Schema to validate user profile update (form data). */
exports.userUpdateProfileSchema = {
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
    },
    additionalProperties: false, // Allow additional properties for form data
    required: ['name', 'email']
};
/** Schema to validate admin create user API. */
exports.userAdminCreateSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 250 },
        email: { type: 'string', format: 'email', maxLength: 250 },
        password: { type: 'string', minLength: 6, maxLength: 100 },
        role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'STAFF'] },
        permission_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
    },
    additionalProperties: false,
    required: ['name', 'email', 'password', 'role']
};
/** Schema to validate admin update user API. */
exports.userAdminUpdateSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 250 },
        email: { type: 'string', format: 'email', maxLength: 250 },
        role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'STAFF'] },
        permission_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
    },
    additionalProperties: false,
    required: ['name', 'email', 'role']
};
