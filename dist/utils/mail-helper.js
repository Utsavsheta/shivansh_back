"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordMail = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const smtp_service_1 = require("./smtp-service");
// import env from './validate-env';
/**
 * Send a forgot password email to a user with their new password
 * @param params Object containing name, email, password, user_type
 */
const sendForgotPasswordMail = ({ name, email, password, user_type }) => {
    // Read the HTML template
    const templatePath = path_1.default.join(__dirname, '../contents/forgot-password-mail.html');
    let html = fs_1.default.readFileSync(templatePath, 'utf-8');
    // Replace placeholders
    html = html.replace(/{{name}}/g, name)
        .replace(/{{email}}/g, email)
        .replace(/{{password}}/g, password)
        .replace(/{{user_type}}/g, user_type);
    // Send the email
    (0, smtp_service_1.sendEmail)({
        to: email,
        subject: 'Your Course Institute Password Has Been Reset',
        html
    });
};
exports.sendForgotPasswordMail = sendForgotPasswordMail;
