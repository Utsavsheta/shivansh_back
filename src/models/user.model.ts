import { Sequelize, Model, DataTypes } from 'sequelize';
import cryptoHelper from '../utils/crypto-helper';

export class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: 'ADMIN' | 'MANAGER' | 'STAFF';
    public created_at!: Date;
    public updated_at!: Date;
    public is_deleted!: boolean;


    static initModel(connection: Sequelize) {
        User.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('ADMIN', 'MANAGER', 'STAFF'),
                allowNull: false,
                defaultValue: 'STAFF',
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
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
        User.addHook('beforeCreate', async (user: User) => {
            if (user.password) {
                user.password = await cryptoHelper.hashAsync(user.password);
            }
        });
    }

    static initAssociations() {
        
    }
}