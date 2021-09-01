import { Request, Response, NextFunction } from 'express';
import config from './../../config/config';
import { errorMessage } from './../../config/enum';
import generalHelper from './../../helpers/general.helper';

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return generalHelper.response.unauthorized(res, {
                message: 'Header authorization not found'
            });

        const base64 = authHeader.split(' ')[1];
        const auth = Buffer.from(base64, 'base64').toString().split(':');

        if (auth[0] === config.api.private.clientId && auth[1] === config.api.private.clientSecret) next();
        else
            return generalHelper.response.unauthorized(res, {
                message: 'Unauthorized Client ID and Client Secret'
            });
    } catch (error) {
        generalHelper.saveErrorLog(error);
        return generalHelper.response.error(res, {
            message: errorMessage.UNKNOWN
        });
    }
};
