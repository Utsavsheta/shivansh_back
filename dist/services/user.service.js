"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = require("../models/user.model");
/** Get all users */
const getAllUsers = async (search, role) => {
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.like]: `%${search}%` } },
            { email: { [sequelize_1.Op.like]: `%${search}%` } }
        ];
    }
    if (role) {
        whereClause.role = role;
    }
    return await user_model_1.User.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'role', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};
/** Get all users with pagination */
const getAllUsersPaginated = async (page = 1, limit = 10, search, role) => {
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.like]: `%${search}%` } },
            { email: { [sequelize_1.Op.like]: `%${search}%` } }
        ];
    }
    if (role) {
        whereClause.role = role;
    }
    const { count, rows: users } = await user_model_1.User.findAndCountAll({
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
const findUserById = async (id, transaction) => {
    return await user_model_1.User.findOne({
        where: {
            id,
            is_deleted: false
        },
        attributes: ['id', 'name', 'email', 'password', 'role', 'created_at'],
        transaction
    });
};
/** Create new user */
const createUser = async (userData, transaction) => {
    return await user_model_1.User.create(userData, { transaction });
};
/** Update user */
const updateUser = async (id, updateData, transaction) => {
    const [affected] = await user_model_1.User.update(updateData, {
        where: { id },
        transaction
    });
    return affected;
};
/** Find user by email */
const findUserByEmail = async (email, excludeUserId) => {
    const whereClause = {
        email,
        is_deleted: false
    };
    if (excludeUserId) {
        whereClause.id = { [sequelize_1.Op.ne]: excludeUserId };
    }
    return await user_model_1.User.findOne({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'password', 'role', 'created_at'],
    });
};
/** Delete user */
const deleteUser = async (id, transaction) => {
    const [affected] = await user_model_1.User.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};
exports.default = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    getAllUsers,
    getAllUsersPaginated,
    deleteUser
};
