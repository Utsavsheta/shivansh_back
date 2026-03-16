import { Sequelize, Model, DataTypes } from 'sequelize';

export class UserPermission extends Model {
    public id!: string;
    public user_id!: string;
    public permission_ids!: string[];
    public created_at!: Date;
    public updated_at!: Date;
    public is_deleted!: boolean;

    static initModel(connection: Sequelize) {
        UserPermission.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            permission_ids: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
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

