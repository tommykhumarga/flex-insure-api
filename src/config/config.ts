import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'flex-insure';
const MONGO_USER = process.env.MONGO_USER || 'flex-insure';
const MONGO_PASS = process.env.MONGO_PASS || 'flex-insure';

const config = {
    app: {
        env: NODE_ENV
    },
    server: {
        hostname: SERVER_HOSTNAME,
        port: SERVER_PORT
    },
    mongo: {
        host: `${MONGO_HOST}:${MONGO_PORT}`,
        user: MONGO_USER,
        pass: MONGO_PASS,
        url: `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
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
