"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const validate_env_1 = __importDefault(require("./validate-env"));
const smtpConfig = {
    service: validate_env_1.default.SMTP_SERVICE,
    host: validate_env_1.default.SMTP_HOST,
    port: validate_env_1.default.SMTP_PORT,
    secure: validate_env_1.default.SMTP_SECURE,
    auth: {
        user: validate_env_1.default.SMTP_EMAIL,
        pass: validate_env_1.default.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: validate_env_1.default.SMTP_SECURE,
    },
};
const transporter = nodemailer_1.default.createTransport(smtpConfig);
const sendEmail = (mailOptions) => {
    transporter.sendMail(Object.assign({ from: validate_env_1.default.SMTP_EMAIL }, mailOptions));
};
exports.sendEmail = sendEmail;
