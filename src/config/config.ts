import dotenv from 'dotenv';

dotenv.config();

const config = {
    server: {
        hostname: process.env.SERVER_HOSTNAME || 'localhost',
        port: process.env.SERVER_PORT || 3000
    }
};

export default config;
