import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { sequelize } from '../server';
import permissionService from '../services/permission.service';
import { sendBadRequestResponse, sendConflictErrorResponse, sendNotFoundResponse, sendSuccessResponse } from '../utils/http-status';

/** GET API: Get all permissions */
const getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query;

        const permissions = await permissionService.getAllPermissions(search as string);
        if (!permissions.length) {
            return sendSuccessResponse(res, 'No permissions found.', permissions);
        }

        sendSuccessResponse(res, 'Permissions fetched successfully.', permissions);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch permissions.', error);
        next(error);
    }
};

/** GET API: Get all permissions with pagination */
const getAllPermissionsPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, search } = req.query;

        const paginatedPermissions = await permissionService.getAllPermissionsPaginated(page as unknown as number, limit as unknown as number, search as string);
        if (!paginatedPermissions.permissions.length) {
            return sendSuccessResponse(res, 'No permissions found.', paginatedPermissions);
        }

        sendSuccessResponse(res, 'Permissions fetched successfully.', paginatedPermissions);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch permissions.', error);
        next(error);
    }
};

/** GET API: Get permission by ID */
const getPermissionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const permission = await permissionService.findPermissionById(id as string);
        if (!permission) {
            return sendNotFoundResponse(res, 'Permission not found.');
        }

        sendSuccessResponse(res, 'Permission fetched successfully.', permission);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch permission.', error);
        next(error);
    }
};

/** POST API: Create permission */
const createPermission = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { name } = req.body;

        const existing = await permissionService.findPermissionByName(name as string);
        if (existing) {
            await transaction.rollback();
            return sendConflictErrorResponse(res, 'Permission with this name already exists!');
        }

        const permission = await permissionService.createPermission({ name: name as string }, transaction);
        if (!permission) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Failed to create permission.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'Permission created successfully.', permission);
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to create permission.', error);
        next(error);
    }
};

/** PUT API: Update permission */
const updatePermission = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { name } = req.body;

        const existingPermission = await permissionService.findPermissionById(id as string);
        if (!existingPermission) {
            await transaction.rollback();
            return sendNotFoundResponse(res, 'Permission not found.');
        }

        const nameExists = await permissionService.findPermissionByName(name as string, id as string);
        if (nameExists) {
            await transaction.rollback();
            return sendConflictErrorResponse(res, 'Permission with this name already exists!');
        }

        const updatedRowsCount = await permissionService.updatePermission(id as string, { name: name as string }, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Permission not found or no changes made.');
        }

        const updated = await permissionService.findPermissionById(id as string, transaction);
        await transaction.commit();

        sendSuccessResponse(res, 'Permission updated successfully.', updated);
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to update permission.', error);
        next(error);
    }
};

/** DELETE API: Delete permission */
const deletePermission = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const existingPermission = await permissionService.findPermissionById(id as string);
        if (!existingPermission) {
            await transaction.rollback();
            return sendNotFoundResponse(res, 'Permission not found.');
        }

        const updatedRowsCount = await permissionService.deletePermission(id as string, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Permission not found or already deleted.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'Permission deleted successfully.');
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to delete permission.', error);
        next(error);
    }
};

export default {
    getAllPermissions,
    getAllPermissionsPaginated,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
};

