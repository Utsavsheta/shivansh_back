"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
class Category extends sequelize_1.Model {
    static initModel(connection) {
        Category.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            category_name: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            slug: {
                type: sequelize_1.DataTypes.STRING(300),
                allowNull: false,
            },
            category_image_url: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('ACTIVE', 'INACTIVE'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            tableName: 'category',
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
exports.Category = Category;
