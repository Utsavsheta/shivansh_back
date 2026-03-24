"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionUpdateSchema = exports.permissionCreateSchema = exports.permissionGetAllPaginatedSchema = exports.permissionGetAllSchema = void 0;
/** Schema to validate permissionGetAll API. */
exports.permissionGetAllSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
    },
};
/** Schema to validate permissionGetAllPaginated API. */
exports.permissionGetAllPaginatedSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        page: {
            type: 'string',
            pattern: '^[1-9][0-9]*$'
        },
        limit: {
            type: 'string',
            pattern: '^[1-9][0-9]*$'
        }
    },
};
/** Schema to validate permission create API. */
exports.permissionCreateSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 250
        },
    },
    required: ['name']
};
/** Schema to validate permission update API. */
exports.permissionUpdateSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 250
        },
    },
    required: ['name']
};
