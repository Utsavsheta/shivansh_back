"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMySQLModels = void 0;
const user_model_1 = require("./user.model");
const permission_model_1 = require("./permission.model");
const user_permission_model_1 = require("./user-permission.model");
const category_model_1 = require("./category.model");
const jewellery_type_model_1 = require("./jewellery-type.model");
const product_model_1 = require("./product.model");
const initMySQLModels = (connection) => {
    // init models here
    user_model_1.User.initModel(connection);
    permission_model_1.Permission.initModel(connection);
    user_permission_model_1.UserPermission.initModel(connection);
    category_model_1.Category.initModel(connection);
    jewellery_type_model_1.JewelleryType.initModel(connection);
    product_model_1.Product.initModel(connection);
    // init associations here
    user_model_1.User.initAssociations();
    permission_model_1.Permission.initAssociations();
    user_permission_model_1.UserPermission.initAssociations();
    category_model_1.Category.initAssociations();
    jewellery_type_model_1.JewelleryType.initAssociations();
    product_model_1.Product.initAssociations();
    // init hooks here
    user_model_1.User.initHooks();
    permission_model_1.Permission.initHooks();
    user_permission_model_1.UserPermission.initHooks();
    category_model_1.Category.initHooks();
    jewellery_type_model_1.JewelleryType.initHooks();
    product_model_1.Product.initHooks();
};
exports.initMySQLModels = initMySQLModels;
