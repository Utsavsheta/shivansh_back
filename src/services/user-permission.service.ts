import { Transaction } from 'sequelize';
import { UserPermission } from '../models/user-permission.model';

const findByUserId = async (user_id: string, transaction?: Transaction) => {
    return await UserPermission.findOne({
        where: {
            user_id,
            is_deleted: false,
        },
        transaction
    });
};

const upsertUserPermissions = async (user_id: string, permission_ids: string[], transaction: Transaction) => {
    const existing = await UserPermission.findOne({
        where: { user_id },
        transaction,
    });

    if (existing) {
        const [affected] = await UserPermission.update(
            { permission_ids, is_deleted: false },
            { where: { user_id }, transaction }
        );
        return affected;
    }

    const created = await UserPermission.create({ user_id, permission_ids }, { transaction });
    return created ? 1 : 0;
};

const softDeleteByUserId = async (user_id: string, transaction: Transaction) => {
    const [affected] = await UserPermission.update(
        { is_deleted: true },
        { where: { user_id }, transaction }
    );
    return affected;
};

export default {
    findByUserId,
    upsertUserPermissions,
    softDeleteByUserId,
};

