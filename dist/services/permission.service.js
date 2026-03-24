"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const permission_model_1 = require("../models/permission.model");
/** Get all permissions */
const getAllPermissions = async (search) => {
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause.name = { [sequelize_1.Op.like]: `%${search}%` };
    }
    return await permission_model_1.Permission.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};
/** Get all permissions with pagination */
const getAllPermissionsPaginated = async (page = 1, limit = 10, search) => {
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause.name = { [sequelize_1.Op.like]: `%${search}%` };
    }
    const { count, rows: permissions } = await permission_model_1.Permission.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'name', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
    });
    return {
        permissions,
        pagination: {
            totalCount: count,
            currentPage: Number(page),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
};
/** Find permission by ID */
const findPermissionById = async (id, transaction) => {
    return await permission_model_1.Permission.findOne({
        where: { id, is_deleted: false },
        attributes: ['id', 'name', 'created_at', 'updated_at'],
        transaction
    });
};
/** Find permission by name */
const findPermissionByName = async (name, excludePermissionId) => {
    const whereClause = { name, is_deleted: false };
    if (excludePermissionId) {
        whereClause.id = { [sequelize_1.Op.ne]: excludePermissionId };
    }
    return await permission_model_1.Permission.findOne({
        where: whereClause,
        attributes: ['id', 'name', 'created_at'],
    });
};
/** Create permission */
const createPermission = async (permissionData, transaction) => {
    return await permission_model_1.Permission.create(permissionData, { transaction });
};
/** Update permission */
const updatePermission = async (id, updateData, transaction) => {
    const [affected] = await permission_model_1.Permission.update(updateData, { where: { id }, transaction });
    return affected;
};
/** Delete permission */
const deletePermission = async (id, transaction) => {
    const [affected] = await permission_model_1.Permission.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};
exports.default = {
    getAllPermissions,
    getAllPermissionsPaginated,
    findPermissionById,
    findPermissionByName,
    createPermission,
    updatePermission,
    deletePermission,
};
