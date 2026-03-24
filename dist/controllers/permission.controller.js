"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const permission_service_1 = __importDefault(require("../services/permission.service"));
const http_status_1 = require("../utils/http-status");
/** GET API: Get all permissions */
const getAllPermissions = async (req, res, next) => {
    try {
        const { search } = req.query;
        const permissions = await permission_service_1.default.getAllPermissions(search);
        if (!permissions.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No permissions found.', permissions);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Permissions fetched successfully.', permissions);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch permissions.', error);
        next(error);
    }
};
/** GET API: Get all permissions with pagination */
const getAllPermissionsPaginated = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query;
        const paginatedPermissions = await permission_service_1.default.getAllPermissionsPaginated(page, limit, search);
        if (!paginatedPermissions.permissions.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No permissions found.', paginatedPermissions);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Permissions fetched successfully.', paginatedPermissions);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch permissions.', error);
        next(error);
    }
};
/** GET API: Get permission by ID */
const getPermissionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permission = await permission_service_1.default.findPermissionById(id);
        if (!permission) {
            return (0, http_status_1.sendNotFoundResponse)(res, 'Permission not found.');
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Permission fetched successfully.', permission);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch permission.', error);
        next(error);
    }
};
/** POST API: Create permission */
const createPermission = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { name } = req.body;
        const existing = await permission_service_1.default.findPermissionByName(name);
        if (existing) {
            await transaction.rollback();
            return (0, http_status_1.sendConflictErrorResponse)(res, 'Permission with this name already exists!');
        }
        const permission = await permission_service_1.default.createPermission({ name: name }, transaction);
        if (!permission) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create permission.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Permission created successfully.', permission);
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create permission.', error);
        next(error);
    }
};
/** PUT API: Update permission */
const updatePermission = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { name } = req.body;
        const existingPermission = await permission_service_1.default.findPermissionById(id);
        if (!existingPermission) {
            await transaction.rollback();
            return (0, http_status_1.sendNotFoundResponse)(res, 'Permission not found.');
        }
        const nameExists = await permission_service_1.default.findPermissionByName(name, id);
        if (nameExists) {
            await transaction.rollback();
            return (0, http_status_1.sendConflictErrorResponse)(res, 'Permission with this name already exists!');
        }
        const updatedRowsCount = await permission_service_1.default.updatePermission(id, { name: name }, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Permission not found or no changes made.');
        }
        const updated = await permission_service_1.default.findPermissionById(id, transaction);
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Permission updated successfully.', updated);
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update permission.', error);
        next(error);
    }
};
/** DELETE API: Delete permission */
const deletePermission = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const existingPermission = await permission_service_1.default.findPermissionById(id);
        if (!existingPermission) {
            await transaction.rollback();
            return (0, http_status_1.sendNotFoundResponse)(res, 'Permission not found.');
        }
        const updatedRowsCount = await permission_service_1.default.deletePermission(id, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Permission not found or already deleted.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Permission deleted successfully.');
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to delete permission.', error);
        next(error);
    }
};
exports.default = {
    getAllPermissions,
    getAllPermissionsPaginated,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
};
