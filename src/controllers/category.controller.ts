import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { sequelize } from '../server';
import categoryService from '../services/category.service';
import { removeMediaFile } from '../utils/file-service';
import { slugify } from '../utils/slug-helper';
import { sendBadRequestResponse, sendConflictErrorResponse, sendNotFoundResponse, sendSuccessResponse } from '../utils/http-status';

/** GET API: Get all categories */
const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, status } = req.query;

        const categories = await categoryService.getAllCategories(search as string, status as string);
        if (!categories.length) {
            return sendSuccessResponse(res, 'No categories found.', categories);
        }

        sendSuccessResponse(res, 'Categories fetched successfully.', categories);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch categories.', error);
        next(error);
    }
};

/** GET API: Get all categories with pagination */
const getAllCategoriesPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, search, status } = req.query;

        const paginated = await categoryService.getAllCategoriesPaginated(page as unknown as number, limit as unknown as number, search as string, status as string);
        if (!paginated.categories.length) {
            return sendSuccessResponse(res, 'No categories found.', paginated);
        }

        sendSuccessResponse(res, 'Categories fetched successfully.', paginated);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch categories.', error);
        next(error);
    }
};

/** GET API: Get category by ID */
const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const category = await categoryService.findCategoryById(id as string);
        if (!category) {
            return sendNotFoundResponse(res, 'Category not found.');
        }

        sendSuccessResponse(res, 'Category fetched successfully.', category);
    } catch (error) {
        sendBadRequestResponse(res, 'Failed to fetch category.', error);
        next(error);
    }
};

/** POST API: Create category (multipart: category_image optional) */
const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { category_name, status } = req.body;

        const slug = slugify(category_name);
        const slugExists = await categoryService.findCategoryBySlug(slug);
        if (slugExists) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/categories/${req.file.filename}`);
            return sendConflictErrorResponse(res, 'Category slug already exists!');
        }

        const category_image_url = req.file ? `media/categories/${req.file.filename}` : null;

        const category = await categoryService.createCategory({
            category_name,
            slug,
            category_image_url,
            status: status || 'ACTIVE',
        }, transaction);

        if (!category) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/categories/${req.file.filename}`);
            return sendBadRequestResponse(res, 'Failed to create category.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'Category created successfully.', category);
    } catch (error) {
        await transaction.rollback();
        if (req.file) removeMediaFile(`media/categories/${req.file.filename}`);
        sendBadRequestResponse(res, 'Failed to create category.', error);
        next(error);
    }
};

/** PUT API: Update category (multipart: category_image optional) */
const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { category_name, status } = req.body;

        const existing = await categoryService.findCategoryById(id as string);
        if (!existing) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/categories/${req.file.filename}`);
            return sendNotFoundResponse(res, 'Category not found.');
        }

        const slug = slugify(category_name);
        const slugExists = await categoryService.findCategoryBySlug(slug, id as string);
        if (slugExists) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/categories/${req.file.filename}`);
            return sendConflictErrorResponse(res, 'Category slug already exists!');
        }

        const updateData: any = {
            category_name,
            slug,
            status: status || existing.status,
        };

        if (req.file) {
            updateData.category_image_url = `media/categories/${req.file.filename}`;
        }

        const updatedRowsCount = await categoryService.updateCategory(id as string, updateData, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            if (req.file) removeMediaFile(`media/categories/${req.file.filename}`);
            return sendBadRequestResponse(res, 'Category not found or no changes made.');
        }

        // Remove old file only after successful DB update
        if (req.file && existing.category_image_url) {
            removeMediaFile(existing.category_image_url);
        }

        const updated = await categoryService.findCategoryById(id as string, transaction);
        await transaction.commit();

        sendSuccessResponse(res, 'Category updated successfully.', updated);
    } catch (error) {
        await transaction.rollback();
        if (req.file) removeMediaFile(`media/categories/${req.file.filename}`);
        sendBadRequestResponse(res, 'Failed to update category.', error);
        next(error);
    }
};

/** DELETE API: Delete category */
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const existing = await categoryService.findCategoryById(id as string);
        if (!existing) {
            await transaction.rollback();
            return sendNotFoundResponse(res, 'Category not found.');
        }

        const updatedRowsCount = await categoryService.deleteCategory(id as string, transaction);
        if (updatedRowsCount === 0) {
            await transaction.rollback();
            return sendBadRequestResponse(res, 'Category not found or already deleted.');
        }

        await transaction.commit();
        sendSuccessResponse(res, 'Category deleted successfully.');
    } catch (error) {
        await transaction.rollback();
        sendBadRequestResponse(res, 'Failed to delete category.', error);
        next(error);
    }
};

export default {
    getAllCategories,
    getAllCategoriesPaginated,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};

