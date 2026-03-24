"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMedia = void 0;
const sequelize_1 = require("sequelize");
class UserMedia extends sequelize_1.Model {
    static initModel(connection) {
        UserMedia.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            filename: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            extension: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            filesize: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            sys_filename: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            tableName: 'user_media',
            sequelize: connection,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
    static initHooks() {
    }
    static initAssociations() {
    }
}
exports.UserMedia = UserMedia;
