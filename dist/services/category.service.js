"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const category_model_1 = require("../models/category.model");
/** Get all categories */
const getAllCategories = async (search, status) => {
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause[sequelize_1.Op.or] = [
            { category_name: { [sequelize_1.Op.like]: `%${search}%` } },
            { slug: { [sequelize_1.Op.like]: `%${search}%` } },
        ];
    }
    if (status) {
        whereClause.status = status;
    }
    return await category_model_1.Category.findAll({
        where: whereClause,
        attributes: ['id', 'category_name', 'slug', 'category_image_url', 'status', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};
/** Get all categories with pagination */
const getAllCategoriesPaginated = async (page = 1, limit = 10, search, status) => {
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause[sequelize_1.Op.or] = [
            { category_name: { [sequelize_1.Op.like]: `%${search}%` } },
            { slug: { [sequelize_1.Op.like]: `%${search}%` } },
        ];
    }
    if (status) {
        whereClause.status = status;
    }
    const { count, rows: categories } = await category_model_1.Category.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'category_name', 'slug', 'category_image_url', 'status', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
    });
    return {
        categories,
        pagination: {
            totalCount: count,
            currentPage: Number(page),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
};
/** Find category by ID */
const findCategoryById = async (id, transaction) => {
    return await category_model_1.Category.findOne({
        where: { id, is_deleted: false },
        attributes: ['id', 'category_name', 'slug', 'category_image_url', 'status', 'created_at', 'updated_at'],
        transaction
    });
};
/** Find category by slug */
const findCategoryBySlug = async (slug, excludeCategoryId) => {
    const whereClause = { slug, is_deleted: false };
    if (excludeCategoryId) {
        whereClause.id = { [sequelize_1.Op.ne]: excludeCategoryId };
    }
    return await category_model_1.Category.findOne({
        where: whereClause,
        attributes: ['id', 'category_name', 'slug', 'status', 'created_at'],
    });
};
/** Create category */
const createCategory = async (categoryData, transaction) => {
    return await category_model_1.Category.create(categoryData, { transaction });
};
/** Update category */
const updateCategory = async (id, updateData, transaction) => {
    const [affected] = await category_model_1.Category.update(updateData, { where: { id }, transaction });
    return affected;
};
/** Delete category */
const deleteCategory = async (id, transaction) => {
    const [affected] = await category_model_1.Category.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};
exports.default = {
    getAllCategories,
    getAllCategoriesPaginated,
    findCategoryById,
    findCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
};
