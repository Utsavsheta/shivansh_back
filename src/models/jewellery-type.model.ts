import { Sequelize, Model, DataTypes } from 'sequelize';

export class JewelleryType extends Model {
    public id!: string;
    public type_name!: string;
    public image_url!: string | null;
    public status!: 'ACTIVE' | 'INACTIVE';
    public created_at!: Date;
    public updated_at!: Date;
    public is_deleted!: boolean;

    static initModel(connection: Sequelize) {
        JewelleryType.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            type_name: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            image_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            tableName: 'jewellery_type',
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

