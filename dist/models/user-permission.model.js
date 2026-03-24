"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermission = void 0;
const sequelize_1 = require("sequelize");
class UserPermission extends sequelize_1.Model {
    static initModel(connection) {
        UserPermission.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            permission_ids: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            tableName: 'user_permission',
            sequelize: connection,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
    static initAssociations() {
    }
    static initHooks() {
    }
}
exports.UserPermission = UserPermission;
