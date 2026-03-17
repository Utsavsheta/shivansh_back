/** Schema to validate permissionGetAll API. */
export const permissionGetAllSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
    },
    
};

/** Schema to validate permissionGetAllPaginated API. */
export const permissionGetAllPaginatedSchema = {
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
export const permissionCreateSchema = {
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
export const permissionUpdateSchema = {
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

