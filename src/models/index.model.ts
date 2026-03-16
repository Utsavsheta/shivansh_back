import { Sequelize } from 'sequelize';
import { User } from './user.model';

export const initMySQLModels = (connection: Sequelize) => {
    // init models here
    User.initModel(connection);

    // init associations here
    User.initAssociations();

    // init hooks here
    User.initHooks();
};