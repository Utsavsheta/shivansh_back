"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = void 0;
const category_model_1 = require("../models/category.model");
const constants_1 = require("./constants");
const seedCategories = async (connection) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await category_model_1.Category.count({ transaction });
        if (existingCount > 0) {
            console.log(`Categories already exist (${existingCount} records). Skipping category seeding.`);
            await transaction.commit();
            return;
        }
        console.log('No categories found. Starting category seeding...');
        await category_model_1.Category.bulkCreate(constants_1.DEFAULT_CATEGORIES, {
            transaction,
            updateOnDuplicate: ['category_name', 'slug', 'category_image_url', 'status', 'is_deleted', 'updated_at']
        });
        console.log(`Bulk processed ${constants_1.DEFAULT_CATEGORIES.length} categories successfully`);
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        console.log('Error seeding categories: ', error);
        throw error;
    }
};
exports.seedCategories = seedCategories;
