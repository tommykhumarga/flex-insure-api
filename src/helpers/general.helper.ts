import { Response } from 'express';
import logger from './../lib/logger';

const saveErrorLog = (err: any) => {
    logger.error(err);
};

const saveDebugLog = (debug: any) => {
    logger.debug(debug);
};

const response = {
    success: (res: Response, data: any) => {
        return res.status(200).json(data);
    },
    unauthorized: (res: Response, data: any) => {
        return res.status(401).json(data);
    },
    notFound: (res: Response, data: any) => {
        return res.status(404).json(data);
    },
    error: (res: Response, data: any) => {
        return res.status(500).json(data);
    },
    custom: (res: Response, status: number, data: any) => {
        return res.status(status).json(data);
    }
};

export default {
    saveErrorLog,
    saveDebugLog,
    response
};
