import { Sequelize, Model, DataTypes } from 'sequelize';

export class Product extends Model {
    public id!: string;
    public product_name!: string;
    public product_sku!: string;
    public weight!: number | null;
    public description!: string | null;
    public size_information!: string | null;
    public category_ids!: string[];
    public type_ids!: string[];
    public product_image_urls!: string[];
    public product_video_url!: string | null;
    public model_3d_url!: string | null;
    public available_pieces!: number;
    public status!: 'ACTIVE' | 'INACTIVE';
    public created_at!: Date;
    public updated_at!: Date;

    static initModel(connection: Sequelize) {
        Product.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            product_name: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            product_sku: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            weight: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,   
                allowNull: true,
            },
            size_information: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            category_ids: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            type_ids: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            product_image_urls: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            product_video_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            model_3d_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            available_pieces: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
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

