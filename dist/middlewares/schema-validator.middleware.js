"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const http_status_1 = require("../utils/http-status");
const ajv = new ajv_1.default();
(0, ajv_formats_1.default)(ajv);
/** Validate schemas and missing params */
const validateSchema = (schema, type) => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        const valid = validate(req[type]);
        if (!valid)
            return (0, http_status_1.sendBadRequestResponse)(res, 'Incorrect or missing parameters.', validate.errors);
        next();
    };
};
exports.validateSchema = validateSchema;
