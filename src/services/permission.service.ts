import { Op, Transaction } from 'sequelize';
import { PaginatedPermissions } from '../interfaces/permission.interfaces';
import { Permission } from '../models/permission.model';

/** Get all permissions */
const getAllPermissions = async (search?: string): Promise<Permission[]> => {
    const whereClause: any = { is_deleted: false };

    if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
    }

    return await Permission.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};

/** Get all permissions with pagination */
const getAllPermissionsPaginated = async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedPermissions> => {
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = { is_deleted: false };
    if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows: permissions } = await Permission.findAndCountAll({
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
const findPermissionById = async (id: string, transaction?: Transaction) => {
    return await Permission.findOne({
        where: { id, is_deleted: false },
        attributes: ['id', 'name', 'created_at', 'updated_at'],
        transaction
    });
};

/** Find permission by name */
const findPermissionByName = async (name: string, excludePermissionId?: string) => {
    const whereClause: any = { name, is_deleted: false };
    if (excludePermissionId) {
        whereClause.id = { [Op.ne]: excludePermissionId };
    }

    return await Permission.findOne({
        where: whereClause,
        attributes: ['id', 'name', 'created_at'],
    });
};

/** Create permission */
const createPermission = async (permissionData: Partial<Permission>, transaction: Transaction) => {
    return await Permission.create(permissionData, { transaction });
};

/** Update permission */
const updatePermission = async (id: string, updateData: Partial<Permission>, transaction: Transaction) => {
    const [affected] = await Permission.update(updateData, { where: { id }, transaction });
    return affected;
};

/** Delete permission */
const deletePermission = async (id: string, transaction: Transaction) => {
    const [affected] = await Permission.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};

export default {
    getAllPermissions,
    getAllPermissionsPaginated,
    findPermissionById,
    findPermissionByName,
    createPermission,
    updatePermission,
    deletePermission,
};

