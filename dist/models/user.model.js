"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const crypto_helper_1 = __importDefault(require("../utils/crypto-helper"));
class User extends sequelize_1.Model {
    static initModel(connection) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: false,
            },
            password: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            role: {
                type: sequelize_1.DataTypes.ENUM('ADMIN', 'MANAGER', 'STAFF'),
                allowNull: false,
                defaultValue: 'STAFF',
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            tableName: 'user',
            sequelize: connection,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
    static initHooks() {
        User.addHook('beforeCreate', async (user) => {
            if (user.password) {
                user.password = await crypto_helper_1.default.hashAsync(user.password);
            }
        });
    }
    static initAssociations() {
    }
}
exports.User = User;
