"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMySQLModels = void 0;
const user_model_1 = require("./user.model");
const permission_model_1 = require("./permission.model");
const initMySQLModels = (connection) => {
    // init models here
    user_model_1.User.initModel(connection);
    permission_model_1.Permission.initModel(connection);
    // init associations here
    user_model_1.User.initAssociations();
    permission_model_1.Permission.initAssociations();
    // init hooks here
    user_model_1.User.initHooks();
    permission_model_1.Permission.initHooks();
};
exports.initMySQLModels = initMySQLModels;
