/** Schema to validate jewelleryTypeGetAll API. */
export const jewelleryTypeGetAllSchema = {
    type: 'object',
    properties: {
        search: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    
};

/** Schema to validate jewelleryTypeGetAllPaginated API. */
export const jewelleryTypeGetAllPaginatedSchema = {
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

/** Schema to validate jewellery type create API (multipart: image optional). */
export const jewelleryTypeCreateSchema = {
    type: 'object',
    properties: {
        type_name: { type: 'string', minLength: 1, maxLength: 250 },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    
    required: ['type_name']
};

/** Schema to validate jewellery type update API (multipart: image optional). */
export const jewelleryTypeUpdateSchema = {
    type: 'object',
    properties: {
        type_name: { type: 'string', minLength: 1, maxLength: 250 },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    },
    
    required: ['type_name']
};

