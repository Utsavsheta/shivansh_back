"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = void 0;
const permission_model_1 = require("../models/permission.model");
const constants_1 = require("./constants");
const seedPermissions = async (connection) => {
    const transaction = await connection.transaction();
    try {
        const existingCount = await permission_model_1.Permission.count({ transaction });
        if (existingCount > 0) {
            console.log(`Permissions already exist (${existingCount} records). Skipping permission seeding.`);
            await transaction.commit();
            return;
        }
        console.log('No permissions found. Starting permission seeding...');
        await permission_model_1.Permission.bulkCreate(constants_1.DEFAULT_PERMISSIONS, {
            transaction,
            updateOnDuplicate: ['name', 'is_deleted', 'updated_at']
        });
        console.log(`Bulk processed ${constants_1.DEFAULT_PERMISSIONS.length} permissions successfully`);
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        console.log('Error seeding permissions: ', error);
        throw error;
    }
};
exports.seedPermissions = seedPermissions;
