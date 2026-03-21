import { Sequelize } from 'sequelize';
import { User } from './user.model';
import { Permission } from './permission.model';
import { UserPermission } from './user-permission.model';
import { Category } from './category.model';
import { JewelleryType } from './jewellery-type.model';
import { Product } from './product.model';

export const initMySQLModels = (connection: Sequelize) => {
    // init models here
    User.initModel(connection);
    Permission.initModel(connection);
    UserPermission.initModel(connection);
    Category.initModel(connection);
    JewelleryType.initModel(connection);
    Product.initModel(connection);

    // init associations here
    User.initAssociations();
    Permission.initAssociations();
    UserPermission.initAssociations();
    Category.initAssociations();
    JewelleryType.initAssociations();
    Product.initAssociations();

    // init hooks here
    User.initHooks();
    Permission.initHooks();
    UserPermission.initHooks();
    Category.initHooks();
    JewelleryType.initHooks();
    Product.initHooks();
};