import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logging from './config/logging';
import config from './config/config';
import sampleRoute from './routes/sample';

const NAMESPACE = 'Server';
const app = express();

/** Server protection */
app.use(cors());
app.use(helmet());

/** Logging the request */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `${req.method}, URL ${req.url}, IP ${req.socket.remoteAddress}`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `${req.method}, URL ${req.url}, IP ${req.socket.remoteAddress}, STATUS ${res.statusCode}`);
    });

    next();
});

/** Parse request */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Routes */
app.use('/sample', sampleRoute);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');

    return res.status(200).json({
        message: error.message
    });
});

/** Create the server */
const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));
