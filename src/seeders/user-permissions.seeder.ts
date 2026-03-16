import { Sequelize } from 'sequelize';
import { User } from '../models/user.model';
import { UserPermission } from '../models/user-permission.model';
import { getDefaultPermissionIdsForRole } from '../utils/permission-helper';

export const seedUserPermissions = async (connection: Sequelize) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await UserPermission.count({ transaction });
        if (existingCount > 0) {
            console.log(`User permissions already exist (${existingCount} records). Skipping user_permission seeding.`);
            await transaction.commit();
            return;
        }

        const users = await User.findAll({
            where: { is_deleted: false },
            attributes: ['id', 'role'],
            transaction
        });

        if (!users.length) {
            console.log('No users found. Skipping user_permission seeding.');
            await transaction.commit();
            return;
        }

        const rows = users.map((u: any) => ({
            user_id: u.id,
            permission_ids: getDefaultPermissionIdsForRole(u.role),
            is_deleted: false,
        }));

        await UserPermission.bulkCreate(rows as any, {
            transaction,
            updateOnDuplicate: ['permission_ids', 'is_deleted', 'updated_at']
        });

        console.log(`Bulk processed ${rows.length} user_permission records successfully`);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('Error seeding user_permission: ', error);
        throw error;
    }
};

