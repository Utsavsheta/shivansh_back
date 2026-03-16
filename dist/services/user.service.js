"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = require("../models/user.model");
/** Get all users */
const getAllUsers = (search, role) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield user_model_1.User.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'role', 'created_at'],
        order: [['created_at', 'DESC']]
    });
});
/** Get all users with pagination */
const getAllUsersPaginated = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, search, role) {
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
    const { count, rows: users } = yield user_model_1.User.findAndCountAll({
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
});
/** Find user by ID */
const findUserById = (id, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({
        where: {
            id,
            is_deleted: false
        },
        attributes: ['id', 'name', 'email', 'password', 'role', 'created_at'],
        transaction
    });
});
/** Create new user */
const createUser = (userData, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.create(userData, { transaction });
});
/** Update user */
const updateUser = (id, updateData, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const [affected] = yield user_model_1.User.update(updateData, {
        where: { id },
        transaction
    });
    return affected;
});
/** Find user by email */
const findUserByEmail = (email, excludeUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = {
        email,
        is_deleted: false
    };
    if (excludeUserId) {
        whereClause.id = { [sequelize_1.Op.ne]: excludeUserId };
    }
    return yield user_model_1.User.findOne({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'password', 'role', 'created_at'],
    });
});
/** Delete user */
const deleteUser = (id, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const [affected] = yield user_model_1.User.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
});
exports.default = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUser,
    getAllUsers,
    getAllUsersPaginated,
    deleteUser
};
