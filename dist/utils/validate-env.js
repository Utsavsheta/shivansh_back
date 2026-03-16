"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const env = (0, envalid_1.cleanEnv)(process.env, {
    // Server Environment
    NODE_ENV: (0, envalid_1.str)({ choices: ['development', 'production', 'staging'] }),
    // API Port
    PORT: (0, envalid_1.port)({ default: 3000 }),
    // API URL
    API_URL: (0, envalid_1.str)(),
    // Database Configuration
    MYSQL_USER: (0, envalid_1.str)(),
    MYSQL_PASSWORD: (0, envalid_1.str)(),
    MYSQL_HOST: (0, envalid_1.str)(),
    MYSQL_PORT: (0, envalid_1.port)(),
    DB_NAME: (0, envalid_1.str)(),
    // Secret Key
    SECRET_KEY: (0, envalid_1.str)(),
    // SMTP Configuration
    SMTP_SERVICE: (0, envalid_1.str)({ default: 'gmail' }),
    SMTP_HOST: (0, envalid_1.str)({ default: 'smtp.gmail.com' }),
    SMTP_PORT: (0, envalid_1.port)({ default: 587 }),
    SMTP_SECURE: (0, envalid_1.bool)({ default: false }),
    SMTP_EMAIL: (0, envalid_1.str)({ default: 'disolutiontest@gmail.com' }),
    SMTP_PASSWORD: (0, envalid_1.str)({ default: 'exkmkjwvinkjqcey' }),
    SMTP_RECEIVER_EMAIL: (0, envalid_1.str)({ default: 'ajay.disolution@gmail.com' }),
    // Seed
    SEED: (0, envalid_1.bool)({ default: false }),
});
exports.default = env;
