import { Sequelize, Model, DataTypes } from 'sequelize';

export class Category extends Model {
    public id!: string;
    public category_name!: string;
    public slug!: string;
    public category_image_url!: string | null;
    public status!: 'ACTIVE' | 'INACTIVE';
    public created_at!: Date;
    public updated_at!: Date;
    public is_deleted!: boolean;

    static initModel(connection: Sequelize) {
        Category.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            category_name: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(300),
                allowNull: false,
            },
            category_image_url: {
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

