import { Sequelize, Model, DataTypes } from 'sequelize';

export class UserMedia extends Model {
    public id!: string;
    public filename!: string;
    public extension!: string;
    public filesize!: string;
    public sys_filename!: string;
    public user_id!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public is_deleted!: boolean;

    static initModel(connection: Sequelize) {
        UserMedia.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            filename: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            extension: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            filesize: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            sys_filename: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
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
