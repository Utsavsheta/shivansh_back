"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMySQLModels = void 0;
const user_model_1 = require("./user.model");
const permission_model_1 = require("./permission.model");
const user_permission_model_1 = require("./user-permission.model");
const initMySQLModels = (connection) => {
    // init models here
    user_model_1.User.initModel(connection);
    permission_model_1.Permission.initModel(connection);
    user_permission_model_1.UserPermission.initModel(connection);
    // init associations here
    user_model_1.User.initAssociations();
    permission_model_1.Permission.initAssociations();
    user_permission_model_1.UserPermission.initAssociations();
    // init hooks here
    user_model_1.User.initHooks();
    permission_model_1.Permission.initHooks();
    user_permission_model_1.UserPermission.initHooks();
};
exports.initMySQLModels = initMySQLModels;
