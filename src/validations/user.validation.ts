/** Schema to validate userGetAll API. */
export const userGetAllSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        role: { type: 'string' },
    },
    
};

/** Schema to validate userGetAllPaginated API. */
export const userGetAllPaginatedSchema = {
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
    
};

/** Schema to validate user profile update (form data). */
export const userUpdateProfileSchema = {
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
     // Allow additional properties for form data
    required: ['name', 'email']
};

/** Schema to validate admin create user API. */
export const userAdminCreateSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 250 },
        email: { type: 'string', format: 'email', maxLength: 250 },
        password: { type: 'string', minLength: 6, maxLength: 100 },
        role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'STAFF'] },
        permission_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
    },
    
    required: ['name', 'email', 'password', 'role']
};

/** Schema to validate admin update user API. */
export const userAdminUpdateSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 250 },
        email: { type: 'string', format: 'email', maxLength: 250 },
        role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'STAFF'] },
        permission_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
    },
    
    required: ['name', 'email', 'role']
};