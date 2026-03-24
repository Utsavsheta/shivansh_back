"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryUpdateSchema = exports.categoryCreateSchema = exports.categoryGetAllPaginatedSchema = exports.categoryGetAllSchema = void 0;
/** Schema to validate categoryGetAll API. */
exports.categoryGetAllSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
};
/** Schema to validate categoryGetAllPaginated API. */
exports.categoryGetAllPaginatedSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
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
/** Schema to validate category create API (multipart: file optional). */
exports.categoryCreateSchema = {
    type: 'object',
    properties: {
        category_name: { type: 'string', minLength: 1, maxLength: 250 },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    required: ['category_name']
};
/** Schema to validate category update API (multipart: file optional). */
exports.categoryUpdateSchema = {
    type: 'object',
    properties: {
        category_name: { type: 'string', minLength: 1, maxLength: 250 },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    required: ['category_name']
};
