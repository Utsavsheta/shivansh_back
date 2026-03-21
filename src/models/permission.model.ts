import { Sequelize, Model, DataTypes } from 'sequelize';

export class Permission extends Model {
    public id!: string;
    public name!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public is_deleted!: boolean;

    static initModel(connection: Sequelize) {
        Permission.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            tableName: 'permission',
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

