"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedJewelleryTypes = void 0;
const jewellery_type_model_1 = require("../models/jewellery-type.model");
const constants_1 = require("./constants");
const seedJewelleryTypes = async (connection) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await jewellery_type_model_1.JewelleryType.count({ transaction });
        if (existingCount > 0) {
            console.log(`Jewellery types already exist (${existingCount} records). Skipping jewellery type seeding.`);
            await transaction.commit();
            return;
        }
        console.log('No jewellery types found. Starting jewellery type seeding...');
        await jewellery_type_model_1.JewelleryType.bulkCreate(constants_1.DEFAULT_JEWELLERY_TYPES, {
            transaction,
            updateOnDuplicate: ['type_name', 'image_url', 'status', 'is_deleted', 'updated_at']
        });
        console.log(`Bulk processed ${constants_1.DEFAULT_JEWELLERY_TYPES.length} jewellery types successfully`);
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        console.log('Error seeding jewellery types: ', error);
        throw error;
    }
};
exports.seedJewelleryTypes = seedJewelleryTypes;
