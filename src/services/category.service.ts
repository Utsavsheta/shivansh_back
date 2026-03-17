import { Op, Transaction } from 'sequelize';
import { PaginatedCategories } from '../interfaces/category.interfaces';
import { Category } from '../models/category.model';

/** Get all categories */
const getAllCategories = async (search?: string, status?: string): Promise<Category[]> => {
    const whereClause: any = { is_deleted: false };

    if (search) {
        whereClause[Op.or] = [
            { category_name: { [Op.like]: `%${search}%` } },
            { slug: { [Op.like]: `%${search}%` } },
        ];
    }

    if (status) {
        whereClause.status = status;
    }

    return await Category.findAll({
        where: whereClause,
        attributes: ['id', 'category_name', 'slug', 'category_image_url', 'status', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};

/** Get all categories with pagination */
const getAllCategoriesPaginated = async (page: number = 1, limit: number = 10, search?: string, status?: string): Promise<PaginatedCategories> => {
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = { is_deleted: false };
    if (search) {
        whereClause[Op.or] = [
            { category_name: { [Op.like]: `%${search}%` } },
            { slug: { [Op.like]: `%${search}%` } },
        ];
    }
    if (status) {
        whereClause.status = status;
    }

    const { count, rows: categories } = await Category.findAndCountAll({
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
const findCategoryById = async (id: string, transaction?: Transaction) => {
    return await Category.findOne({
        where: { id, is_deleted: false },
        attributes: ['id', 'category_name', 'slug', 'category_image_url', 'status', 'created_at', 'updated_at'],
        transaction
    });
};

/** Find category by slug */
const findCategoryBySlug = async (slug: string, excludeCategoryId?: string) => {
    const whereClause: any = { slug, is_deleted: false };
    if (excludeCategoryId) {
        whereClause.id = { [Op.ne]: excludeCategoryId };
    }
    return await Category.findOne({
        where: whereClause,
        attributes: ['id', 'category_name', 'slug', 'status', 'created_at'],
    });
};

/** Create category */
const createCategory = async (categoryData: Partial<Category>, transaction: Transaction) => {
    return await Category.create(categoryData, { transaction });
};

/** Update category */
const updateCategory = async (id: string, updateData: Partial<Category>, transaction: Transaction) => {
    const [affected] = await Category.update(updateData, { where: { id }, transaction });
    return affected;
};

/** Delete category */
const deleteCategory = async (id: string, transaction: Transaction) => {
    const [affected] = await Category.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};

export default {
    getAllCategories,
    getAllCategoriesPaginated,
    findCategoryById,
    findCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
};

