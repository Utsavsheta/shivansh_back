"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const permission_routes_1 = __importDefault(require("./permission.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const jewellery_type_routes_1 = __importDefault(require("./jewellery-type.routes"));
const router = (0, express_1.Router)();
router.use('/user', user_routes_1.default);
router.use('/auth', auth_routes_1.default);
router.use('/permission', permission_routes_1.default);
router.use('/category', category_routes_1.default);
router.use('/jewellery-type', jewellery_type_routes_1.default);
exports.default = router;
