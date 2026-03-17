import { Sequelize } from 'sequelize';
import { JewelleryType } from '../models/jewellery-type.model';
import { DEFAULT_JEWELLERY_TYPES } from './constants';

export const seedJewelleryTypes = async (connection: Sequelize) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await JewelleryType.count({ transaction });
        if (existingCount > 0) {
            console.log(`Jewellery types already exist (${existingCount} records). Skipping jewellery type seeding.`);
            await transaction.commit();
            return;
        }

        console.log('No jewellery types found. Starting jewellery type seeding...');

        await JewelleryType.bulkCreate(DEFAULT_JEWELLERY_TYPES as any, {
            transaction,
            updateOnDuplicate: ['type_name', 'image_url', 'status', 'is_deleted', 'updated_at']
        });

        console.log(`Bulk processed ${DEFAULT_JEWELLERY_TYPES.length} jewellery types successfully`);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('Error seeding jewellery types: ', error);
        throw error;
    }
};

