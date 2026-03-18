import { bool, cleanEnv, port, str } from 'envalid';

const env = cleanEnv(process.env, {
    // Server Environment
    NODE_ENV: str({ choices: ['development', 'production', 'staging'] }),

    // API Port
    PORT: port({ default: 5005 }),

    // API URL
    API_URL: str(),

    // Database Configuration
    MYSQL_USER: str(),
    MYSQL_PASSWORD: str(),
    MYSQL_HOST: str(),
    MYSQL_PORT: port(),
    DB_NAME: str(),

    // Secret Key
    SECRET_KEY: str(),

    // SMTP Configuration
    SMTP_SERVICE: str({ default: 'gmail' }),
    SMTP_HOST: str({ default: 'smtp.gmail.com' }),
    SMTP_PORT: port({ default: 587 }),
    SMTP_SECURE: bool({ default: false }),
    SMTP_EMAIL: str({ default: 'disolutiontest@gmail.com' }),
    SMTP_PASSWORD: str({ default: 'exkmkjwvinkjqcey' }),
    SMTP_RECEIVER_EMAIL: str({ default: 'ajay.disolution@gmail.com' }),

    // Seed
    SEED: bool({ default: false }),
});

export default env;