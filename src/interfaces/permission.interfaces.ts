import { Permission } from '../models/permission.model';

export interface PaginatedPermissions {
    permissions: Permission[];
    pagination: {
        totalCount: number;
        currentPage: number;
        totalPages: number;
    };
}

export interface CreatePermissionData {
    name: string;
}

export interface UpdatePermissionData {
    name?: string;
}

