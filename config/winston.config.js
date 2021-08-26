const appRootPath = require('app-root-path');
const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    prettyPrint
} = format;
require('winston-daily-rotate-file');

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.DailyRotateFile({
            filename: 'error-%DATE%.log',
            dirname: `${appRootPath}/logs`,
            level: 'error',
            handleExceptions: true,
            json: true,
            maxSize: 5242880,
            maxFiles: '7d'
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
}

module.exports = logger;