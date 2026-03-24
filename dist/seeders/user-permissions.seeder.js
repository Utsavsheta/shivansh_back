"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUserPermissions = void 0;
const user_model_1 = require("../models/user.model");
const user_permission_model_1 = require("../models/user-permission.model");
const permission_helper_1 = require("../utils/permission-helper");
const seedUserPermissions = async (connection) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await user_permission_model_1.UserPermission.count({ transaction });
        if (existingCount > 0) {
            console.log(`User permissions already exist (${existingCount} records). Skipping user_permission seeding.`);
            await transaction.commit();
            return;
        }
        const users = await user_model_1.User.findAll({
            where: { is_deleted: false },
            attributes: ['id', 'role'],
            transaction
        });
        if (!users.length) {
            console.log('No users found. Skipping user_permission seeding.');
            await transaction.commit();
            return;
        }
        const rows = users.map((u) => ({
            user_id: u.id,
            permission_ids: (0, permission_helper_1.getDefaultPermissionIdsForRole)(u.role),
            is_deleted: false,
        }));
        await user_permission_model_1.UserPermission.bulkCreate(rows, {
            transaction,
            updateOnDuplicate: ['permission_ids', 'is_deleted', 'updated_at']
        });
        console.log(`Bulk processed ${rows.length} user_permission records successfully`);
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        console.log('Error seeding user_permission: ', error);
        throw error;
    }
};
exports.seedUserPermissions = seedUserPermissions;
