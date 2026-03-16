import { Op, Transaction } from 'sequelize';
import { PaginatedUsers } from '../interfaces/user.interfaces';
import { User } from '../models/user.model';

/** Get all users */
const getAllUsers = async (search?: string, role?: string): Promise<User[]> => {
    const whereClause: any = { is_deleted: false };

    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ];
    }

    if (role) {
        whereClause.role = role;
    }

    return await User.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'role', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};

/** Get all users with pagination */
const getAllUsersPaginated = async (page: number = 1, limit: number = 10, search?: string, role?: string): Promise<PaginatedUsers> => {
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = { is_deleted: false };
    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ];
    }

    if (role) {
        whereClause.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'role', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
    });

    return {
        users,
        pagination: {
            totalCount: count,
            currentPage: Number(page),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
};

/** Find user by ID */
const findUserById = async (id: string, transaction?: Transaction) => {
    return await User.findOne({
        where: {
            id,
            is_deleted: false
        },
        attributes: ['id', 'name', 'email', 'password', 'role', 'created_at'],
        transaction
    });
};

/** Create new user */
const createUser = async (userData: Partial<User>, transaction: Transaction) => {
    return await User.create(userData, { transaction });
};

/** Update user */
const updateUser = async (id: string, updateData: Partial<User>, transaction: Transaction) => {
    const [affected] = await User.update(updateData, {
        where: { id },
        transaction
    });
    return affected;
};

/** Find user by email */
const findUserByEmail = async (email: string, excludeUserId?: string) => {
    const whereClause: any = {
        email,
        is_deleted: false
    };

    if (excludeUserId) {
        whereClause.id = { [Op.ne]: excludeUserId };
    }

    return await User.findOne({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'password', 'role', 'created_at'],
    });
};

/** Delete user */
const deleteUser = async (id: string, transaction: Transaction) => {
    const [affected] = await User.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};

export default {
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    getAllUsers,
    getAllUsersPaginated,
    deleteUser
};