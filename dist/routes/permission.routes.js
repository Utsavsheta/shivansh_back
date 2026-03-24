"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permission_controller_1 = __importDefault(require("../controllers/permission.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const schema_validator_middleware_1 = require("../middlewares/schema-validator.middleware");
const permission_validation_1 = require("../validations/permission.validation");
const router = (0, express_1.Router)();
router.get('/all', auth_middleware_1.authenticateToken, (0, schema_validator_middleware_1.validateSchema)(permission_validation_1.permissionGetAllSchema, 'query'), permission_controller_1.default.getAllPermissions);
router.get('/', auth_middleware_1.authenticateToken, (0, schema_validator_middleware_1.validateSchema)(permission_validation_1.permissionGetAllPaginatedSchema, 'query'), permission_controller_1.default.getAllPermissionsPaginated);
router.get('/:id', auth_middleware_1.authenticateToken, permission_controller_1.default.getPermissionById);
router.post('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), (0, schema_validator_middleware_1.validateSchema)(permission_validation_1.permissionCreateSchema, 'body'), permission_controller_1.default.createPermission);
router.put('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), (0, schema_validator_middleware_1.validateSchema)(permission_validation_1.permissionUpdateSchema, 'body'), permission_controller_1.default.updatePermission);
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), permission_controller_1.default.deletePermission);
exports.default = router;
