import dotenv from 'dotenv';

dotenv.config();

const APP_NAME = process.env.APP_NAME || 'FlexInsure API';
const APP_ENV = process.env.APP_ENV || 'development';
const APP_HOSTNAME = process.env.APP_HOSTNAME || 'localhost';
const APP_PORT = process.env.APP_PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'flex-insure';
const DB_USER = process.env.DB_USER || 'flex-insure';
const DB_PASS = process.env.DB_PASS || 'flex-insure';

const config = {
    app: {
        name: APP_NAME,
        env: APP_ENV,
        hostname: APP_HOSTNAME,
        port: APP_PORT
    },
    mongo: {
        host: `${DB_HOST}:${DB_PORT}`,
        user: DB_USER,
        pass: DB_PASS,
        url: `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 3000,
            keepAlive: true,
            autoIndex: false,
            retryWrites: false
        }
    }
};

export default config;
