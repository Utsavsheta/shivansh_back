/** Schema to validate categoryGetAll API. */
export const categoryGetAllSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    additionalProperties: false,
};

/** Schema to validate categoryGetAllPaginated API. */
export const categoryGetAllPaginatedSchema = {
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
    additionalProperties: false,
};

/** Schema to validate category create API (multipart: file optional). */
export const categoryCreateSchema = {
    type: 'object',
    properties: {
        category_name: { type: 'string', minLength: 1, maxLength: 250 },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    additionalProperties: false,
    required: ['category_name']
};

/** Schema to validate category update API (multipart: file optional). */
export const categoryUpdateSchema = {
    type: 'object',
    properties: {
        category_name: { type: 'string', minLength: 1, maxLength: 250 },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    additionalProperties: false,
    required: ['category_name']
};

