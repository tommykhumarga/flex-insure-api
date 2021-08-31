import dotenv from 'dotenv';

dotenv.config();

const APP_NAME = process.env.APP_NAME;
const APP_ENV = process.env.APP_ENV;
const APP_HOSTNAME = process.env.APP_HOSTNAME;
const APP_PORT = process.env.APP_PORT;
const PRIVATE_API_CLIENT_ID = process.env.PRIVATE_API_CLIENT_ID;
const PRIVATE_API_CLIENT_SECRET = process.env.PRIVATE_API_CLIENT_SECRET;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const JWT_KEY = process.env.JWT_KEY;

export default {
    app: {
        name: APP_NAME,
        env: APP_ENV,
        hostname: APP_HOSTNAME,
        port: APP_PORT,
        locale: 'id-ID'
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
            retryWrites: false,
            autoReconnect: true
        }
    },
    api: {
        private: {
            clientId: PRIVATE_API_CLIENT_ID,
            clientSecret: PRIVATE_API_CLIENT_SECRET
        }
    },
    encryption: {
        key: ENCRYPTION_KEY
    },
    jwt: {
        key: JWT_KEY
    }
};
