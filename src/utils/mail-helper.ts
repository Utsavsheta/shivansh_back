import fs from 'fs';
import path from 'path';
import { SendForgotPasswordMailParams } from '../interfaces/smtp.interfaces';
import { sendEmail } from './smtp-service';
// import env from './validate-env';

/**
 * Send a forgot password email to a user with their new password
 * @param params Object containing name, email, password, user_type
 */
export const sendForgotPasswordMail = ({ name, email, password, user_type }: SendForgotPasswordMailParams) => {
    // Read the HTML template
    const templatePath = path.join(__dirname, '../contents/forgot-password-mail.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders
    html = html.replace(/{{name}}/g, name)
        .replace(/{{email}}/g, email)
        .replace(/{{password}}/g, password)
        .replace(/{{user_type}}/g, user_type);

    // Send the email
    sendEmail({
        to: email,
        subject: 'Your Course Institute Password Has Been Reset',
        html
    });
};
