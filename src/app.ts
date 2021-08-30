import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import config from './config/config';
import generalHelper from './helpers/general.helper';
import privateRoute from './routes/private.route';

const app = express();

/** Server protection */
app.use(cors());
app.use(helmet());

/** Connect to MongoDB */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        console.info('Connected to MongoDB');
    })
    .catch((error) => {
        console.error(error.message, error);
    });

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

/** Create the server */
const httpServer = http.createServer(app);
generalHelper.saveDebugLog(`Server running on ${config.server.hostname}:${config.server.port}`);
httpServer.listen(config.server.port, () => console.info(`Server running on ${config.server.hostname}:${config.server.port}`));
