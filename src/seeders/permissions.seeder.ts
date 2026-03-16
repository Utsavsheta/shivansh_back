import { Sequelize } from 'sequelize';
import { Permission } from '../models/permission.model';
import { DEFAULT_PERMISSIONS } from './constants';

export const seedPermissions = async (connection: Sequelize) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await Permission.count({ transaction });
        if (existingCount > 0) {
            console.log(`Permissions already exist (${existingCount} records). Skipping permission seeding.`);
            await transaction.commit();
            return;
        }

        console.log('No permissions found. Starting permission seeding...');

        await Permission.bulkCreate(DEFAULT_PERMISSIONS as any, {
            transaction,
            updateOnDuplicate: ['name', 'is_deleted', 'updated_at']
        });

        console.log(`Bulk processed ${DEFAULT_PERMISSIONS.length} permissions successfully`);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('Error seeding permissions: ', error);
        throw error;
    }
};

