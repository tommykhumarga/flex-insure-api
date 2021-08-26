const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    app: {
        name: process.env.APP_NAME,
        version: process.env.APP_VERSION,
        env: process.env.APP_ENV,
        port: process.env.APP_PORT,
        activationBaseUrl: process.env.APP_ACTIVATION_BASE_URL
    },
    encryption: {
        key: process.env.ENCRYPTION_KEY,
        jwtKey: process.env.JWT_KEY
    },
    api: {
        client: {
            secret: process.env.API_CLIENT_SECRET
        }
    },
    db: {
        url: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}:${process.env.DB_PORT}}/${process.env.DB_NAME}`
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        ssl: process.env.SMTP_SSL,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD
    },
    webapp: {
        baseUrl: process.env.WEBAPP_BASE_URL,
        activationPath: process.env.WEBAPP_ACTIVATION_PATH,
        forgotPasswordPath: process.env.WEBAPP_FORGOT_PASSWORD_PATH
    }
};