import appRoot from 'app-root-path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from './../config/config';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const level = () => {
    const isDevelopment = config.app.env === 'development';

    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transport: DailyRotateFile = new DailyRotateFile({
    filename: 'error-%DATE%.log',
    dirname: `${appRoot}/logs`,
    level: 'error',
    handleExceptions: true,
    json: true,
    maxSize: '20mb',
    maxFiles: '7d'
});

const transports = [new winston.transports.Console(), transport];

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
});

export default logger;
