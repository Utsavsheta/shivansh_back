"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const schema_validator_middleware_1 = require("../middlewares/schema-validator.middleware");
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
router.post('/register', (0, schema_validator_middleware_1.validateSchema)(auth_validation_1.registerSchema, 'body'), auth_controller_1.default.register);
router.post('/login', (0, schema_validator_middleware_1.validateSchema)(auth_validation_1.loginSchema, 'body'), auth_controller_1.default.login);
router.post('/forgot-password', (0, schema_validator_middleware_1.validateSchema)(auth_validation_1.forgotPasswordSchema, 'body'), auth_controller_1.default.forgotPassword);
router.post('/change-password', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN', 'USER', 'INSTRUCTOR']), (0, schema_validator_middleware_1.validateSchema)(auth_validation_1.changePasswordSchema, 'body'), auth_controller_1.default.changePassword);
exports.default = router;
