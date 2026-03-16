import { Sequelize } from 'sequelize';
import { User } from './user.model';
import { Permission } from './permission.model';

export const initMySQLModels = (connection: Sequelize) => {
    // init models here
    User.initModel(connection);
    Permission.initModel(connection);

    // init associations here
    User.initAssociations();
    Permission.initAssociations();

    // init hooks here
    User.initHooks();
    Permission.initHooks();
};