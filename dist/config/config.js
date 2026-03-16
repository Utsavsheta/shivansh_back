"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const validate_env_1 = __importDefault(require("../utils/validate-env"));
exports.config = {
    development: {
        username: validate_env_1.default.MYSQL_USER,
        password: validate_env_1.default.MYSQL_PASSWORD,
        database: `${validate_env_1.default.DB_NAME}_dev`,
        host: validate_env_1.default.MYSQL_HOST,
        port: validate_env_1.default.MYSQL_PORT,
        dialect: 'mysql',
        logging: true
    },
    staging: {
        username: validate_env_1.default.MYSQL_USER,
        password: validate_env_1.default.MYSQL_PASSWORD,
        database: `${validate_env_1.default.DB_NAME}_staging`,
        host: validate_env_1.default.MYSQL_HOST,
        port: validate_env_1.default.MYSQL_PORT,
        dialect: 'mysql',
        logging: true
    },
    production: {
        username: validate_env_1.default.MYSQL_USER,
        password: validate_env_1.default.MYSQL_PASSWORD,
        database: validate_env_1.default.DB_NAME,
        host: validate_env_1.default.MYSQL_HOST,
        port: validate_env_1.default.MYSQL_PORT,
        dialect: 'mysql',
        logging: true
    }
};
