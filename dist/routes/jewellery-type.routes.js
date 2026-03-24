"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jewellery_type_controller_1 = __importDefault(require("../controllers/jewellery-type.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const schema_validator_middleware_1 = require("../middlewares/schema-validator.middleware");
const file_service_1 = require("../utils/file-service");
const jewellery_type_validation_1 = require("../validations/jewellery-type.validation");
const router = (0, express_1.Router)();
router.get('/all', (0, schema_validator_middleware_1.validateSchema)(jewellery_type_validation_1.jewelleryTypeGetAllSchema, 'query'), jewellery_type_controller_1.default.getAllJewelleryTypes);
router.get('/', (0, schema_validator_middleware_1.validateSchema)(jewellery_type_validation_1.jewelleryTypeGetAllPaginatedSchema, 'query'), jewellery_type_controller_1.default.getAllJewelleryTypesPaginated);
router.get('/:id', jewellery_type_controller_1.default.getJewelleryTypeById);
router.post('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), file_service_1.jewelleryTypeImageUpload.single('image'), (0, schema_validator_middleware_1.validateSchema)(jewellery_type_validation_1.jewelleryTypeCreateSchema, 'body'), jewellery_type_controller_1.default.createJewelleryType);
router.put('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), file_service_1.jewelleryTypeImageUpload.single('image'), (0, schema_validator_middleware_1.validateSchema)(jewellery_type_validation_1.jewelleryTypeUpdateSchema, 'body'), jewellery_type_controller_1.default.updateJewelleryType);
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.checkRole)(['ADMIN']), jewellery_type_controller_1.default.deleteJewelleryType);
exports.default = router;
