import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import config from './config/config';
import generalHelper from './helpers/general.helper';
import privateRoute from './private/routes';

const main = async () => {
    const app = express();

    /** Server protection */
    app.use(cors());
    app.use(helmet());

    /** Logging the request */
    app.use((req, res, next) => {
        console.info(`${req.method}, URL ${req.url}, IP ${req.socket.remoteAddress}`);

        res.on('finish', () => {
            console.info(`${req.method}, URL ${req.url}, IP ${req.socket.remoteAddress}, STATUS ${res.statusCode}`);
        });

        next();
    });

    /** Parse request */
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    /** Routes */
    app.use('/private/v1', privateRoute);

    /** Error handling */
    app.use((req, res, next) => {
        const error = new Error('Not found');

        return res.status(200).json({
            message: error.message
        });
    });

    app.listen(config.app.port, () => {
        console.info(`Server running on ${config.app.hostname}:${config.app.port}`);
    });
};

/** Connect to MongoDB */
const connectDb = () => {
    mongoose
        .connect(config.mongo.url, config.mongo.options)
        .then((result) => {
            console.info('Connected to MongoDB');
        })
        .catch((error) => {
            console.error(error.message, error);
        });
};

main()
    .then(() => connectDb())
    .catch((error) => {
        generalHelper.saveErrorLog(error);
        console.error('SERVER', error);
    });
