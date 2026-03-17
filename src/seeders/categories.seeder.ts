import { Sequelize } from 'sequelize';
import { Category } from '../models/category.model';
import { DEFAULT_CATEGORIES } from './constants';

export const seedCategories = async (connection: Sequelize) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await Category.count({ transaction });
        if (existingCount > 0) {
            console.log(`Categories already exist (${existingCount} records). Skipping category seeding.`);
            await transaction.commit();
            return;
        }

        console.log('No categories found. Starting category seeding...');

        await Category.bulkCreate(DEFAULT_CATEGORIES as any, {
            transaction,
            updateOnDuplicate: ['category_name', 'slug', 'category_image_url', 'status', 'is_deleted', 'updated_at']
        });

        console.log(`Bulk processed ${DEFAULT_CATEGORIES.length} categories successfully`);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('Error seeding categories: ', error);
        throw error;
    }
};

