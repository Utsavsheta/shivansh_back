"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const schema_validator_middleware_1 = require("../middlewares/schema-validator.middleware");
const file_service_1 = require("../utils/file-service");
const user_validation_1 = require("../validations/user.validation");
const router = (0, express_1.Router)();
router.get('/all', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), (0, schema_validator_middleware_1.validateSchema)(user_validation_1.userGetAllSchema, 'query'), user_controller_1.default.getAllUsers);
router.get('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), (0, schema_validator_middleware_1.validateSchema)(user_validation_1.userGetAllPaginatedSchema, 'query'), user_controller_1.default.getAllUsersPaginated);
router.get('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), user_controller_1.default.getUserById);
router.get('/profile/me', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN', 'INSTRUCTOR', 'USER']), user_controller_1.default.getCurrentUser);
router.put('/profile', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN', 'INSTRUCTOR', 'USER']), file_service_1.userProfileUpload.single('profile_pic'), (0, schema_validator_middleware_1.validateSchema)(user_validation_1.userUpdateProfileSchema, 'body'), user_controller_1.default.updateUserProfile);
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), user_controller_1.default.deleteUser);
exports.default = router;
