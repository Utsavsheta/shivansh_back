"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const schema_validator_middleware_1 = require("../middlewares/schema-validator.middleware");
const file_service_1 = require("../utils/file-service");
const category_validation_1 = require("../validations/category.validation");
const router = (0, express_1.Router)();
router.get('/all', (0, schema_validator_middleware_1.validateSchema)(category_validation_1.categoryGetAllSchema, 'query'), category_controller_1.default.getAllCategories);
router.get('/', (0, schema_validator_middleware_1.validateSchema)(category_validation_1.categoryGetAllPaginatedSchema, 'query'), category_controller_1.default.getAllCategoriesPaginated);
router.get('/:id', category_controller_1.default.getCategoryById);
router.post('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), file_service_1.categoryMediaUpload.single('category_image'), (0, schema_validator_middleware_1.validateSchema)(category_validation_1.categoryCreateSchema, 'body'), category_controller_1.default.createCategory);
router.put('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), file_service_1.categoryMediaUpload.single('category_image'), (0, schema_validator_middleware_1.validateSchema)(category_validation_1.categoryUpdateSchema, 'body'), category_controller_1.default.updateCategory);
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), category_controller_1.default.deleteCategory);
exports.default = router;
