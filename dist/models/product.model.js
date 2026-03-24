"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
class Product extends sequelize_1.Model {
    static initModel(connection) {
        Product.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            product_name: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            product_sku: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            weight: {
                type: sequelize_1.DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            size_information: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            category_ids: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            type_ids: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            product_image_urls: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            product_video_url: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            model_3d_url: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            available_pieces: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('ACTIVE', 'INACTIVE'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
        }, {
            tableName: 'product',
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
exports.Product = Product;
