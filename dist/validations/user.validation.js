"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateProfileSchema = exports.userGetAllPaginatedSchema = exports.userGetAllSchema = void 0;
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
