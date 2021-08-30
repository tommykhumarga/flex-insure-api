import logger from './../lib/logger';

const saveErrorLog = (err: any) => {
    logger.error(err);
};

const saveDebugLog = (debug: any) => {
    logger.debug(debug);
};

export default {
    saveErrorLog,
    saveDebugLog
};
