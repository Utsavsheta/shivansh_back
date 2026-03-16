import { TransportOptions } from "nodemailer";

export interface SMTPConfig extends TransportOptions {
    service: string;
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    tls: {
        rejectUnauthorized: boolean;
    };
}

export interface MailOptions {
    to: string;
    subject: string;
    html?: string;
    attachments?: any;
}

export interface SendForgotPasswordMailParams {
    name: string;
    email: string;
    password: string;
    user_type: string;
}
