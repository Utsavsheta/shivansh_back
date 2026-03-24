"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const category_service_1 = __importDefault(require("../services/category.service"));
const file_service_1 = require("../utils/file-service");
const slug_helper_1 = require("../utils/slug-helper");
const http_status_1 = require("../utils/http-status");
/** GET API: Get all categories */
const getAllCategories = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        const categories = await category_service_1.default.getAllCategories(search, status);
        if (!categories.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No categories found.', categories);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Categories fetched successfully.', categories);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch categories.', error);
        next(error);
    }
};
/** GET API: Get all categories with pagination */
const getAllCategoriesPaginated = async (req, res, next) => {
    try {
        const { page, limit, search, status } = req.query;
        const paginated = await category_service_1.default.getAllCategoriesPaginated(page, limit, search, status);
        if (!paginated.categories.length) {
            return (0, http_status_1.sendSuccessResponse)(res, 'No categories found.', paginated);
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Categories fetched successfully.', paginated);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch categories.', error);
        next(error);
    }
};
/** GET API: Get category by ID */
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await category_service_1.default.findCategoryById(id);
        if (!category) {
            return (0, http_status_1.sendNotFoundResponse)(res, 'Category not found.');
        }
        (0, http_status_1.sendSuccessResponse)(res, 'Category fetched successfully.', category);
    }
    catch (error) {
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to fetch category.', error);
        next(error);
    }
};
/** POST API: Create category (multipart: category_image optional) */
const createCategory = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { category_name, status } = req.body;
        const slug = (0, slug_helper_1.slugify)(category_name);
        const slugExists = await category_service_1.default.findCategoryBySlug(slug);
        if (slugExists) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/categories/${req.file.filename}`);
            return (0, http_status_1.sendConflictErrorResponse)(res, 'Category slug already exists!');
        }
        const category_image_url = req.file ? `media/categories/${req.file.filename}` : null;
        const category = await category_service_1.default.createCategory({
            category_name,
            slug,
            category_image_url,
            status: status || 'ACTIVE',
        }, transaction);
        if (!category) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/categories/${req.file.filename}`);
            return (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create category.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Category created successfully.', category);
    }
    catch (error) {
        await transaction.rollback();
        if (req.file)
            (0, file_service_1.removeMediaFile)(`media/categories/${req.file.filename}`);
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to create category.', error);
        next(error);
    }
};
/** PUT API: Update category (multipart: category_image optional) */
const updateCategory = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const { category_name, status } = req.body;
        const existing = await category_service_1.default.findCategoryById(id);
        if (!existing) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/categories/${req.file.filename}`);
            return (0, http_status_1.sendNotFoundResponse)(res, 'Category not found.');
        }
        const slug = (0, slug_helper_1.slugify)(category_name);
        const slugExists = await category_service_1.default.findCategoryBySlug(slug, id);
        if (slugExists) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/categories/${req.file.filename}`);
            return (0, http_status_1.sendConflictErrorResponse)(res, 'Category slug already exists!');
        }
        const updateData = {
            category_name,
            slug,
            status: status || existing.status,
        };
        if (req.file) {
            updateData.category_image_url = `media/categories/${req.file.filename}`;
        }
        const updatedRowsCount = await category_service_1.default.updateCategory(id, updateData, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            if (req.file)
                (0, file_service_1.removeMediaFile)(`media/categories/${req.file.filename}`);
            return (0, http_status_1.sendBadRequestResponse)(res, 'Category not found or no changes made.');
        }
        // Remove old file only after successful DB update
        if (req.file && existing.category_image_url) {
            (0, file_service_1.removeMediaFile)(existing.category_image_url);
        }
        const updated = await category_service_1.default.findCategoryById(id, transaction);
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Category updated successfully.', updated);
    }
    catch (error) {
        await transaction.rollback();
        if (req.file)
            (0, file_service_1.removeMediaFile)(`media/categories/${req.file.filename}`);
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to update category.', error);
        next(error);
    }
};
/** DELETE API: Delete category */
const deleteCategory = async (req, res, next) => {
    const transaction = await server_1.sequelize.transaction();
    try {
        const { id } = req.params;
        const existing = await category_service_1.default.findCategoryById(id);
        if (!existing) {
            await transaction.rollback();
            return (0, http_status_1.sendNotFoundResponse)(res, 'Category not found.');
        }
        const updatedRowsCount = await category_service_1.default.deleteCategory(id, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return (0, http_status_1.sendBadRequestResponse)(res, 'Category not found or already deleted.');
        }
        await transaction.commit();
        (0, http_status_1.sendSuccessResponse)(res, 'Category deleted successfully.');
    }
    catch (error) {
        await transaction.rollback();
        (0, http_status_1.sendBadRequestResponse)(res, 'Failed to delete category.', error);
        next(error);
    }
};
exports.default = {
    getAllCategories,
    getAllCategoriesPaginated,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
