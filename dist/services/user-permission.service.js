"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_permission_model_1 = require("../models/user-permission.model");
const findByUserId = async (user_id, transaction) => {
    return await user_permission_model_1.UserPermission.findOne({
        where: {
            user_id,
            is_deleted: false,
        },
        transaction
    });
};
const upsertUserPermissions = async (user_id, permission_ids, transaction) => {
    const existing = await user_permission_model_1.UserPermission.findOne({
        where: { user_id },
        transaction,
    });
    if (existing) {
        const [affected] = await user_permission_model_1.UserPermission.update({ permission_ids, is_deleted: false }, { where: { user_id }, transaction });
        return affected;
    }
    const created = await user_permission_model_1.UserPermission.create({ user_id, permission_ids }, { transaction });
    return created ? 1 : 0;
};
const softDeleteByUserId = async (user_id, transaction) => {
    const [affected] = await user_permission_model_1.UserPermission.update({ is_deleted: true }, { where: { user_id }, transaction });
    return affected;
};
exports.default = {
    findByUserId,
    upsertUserPermissions,
    softDeleteByUserId,
};
