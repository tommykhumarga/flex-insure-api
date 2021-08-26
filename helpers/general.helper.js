const moment = require('moment');
const fs = require('fs');
const nodemailer = require('nodemailer');
const {
    validationResult
} = require('express-validator');
const config = require('./../config/config');
const constants = require('./../config/constants');
const logger = require('./../config/winston.config');

exports.response = {
    success: (res, data) => {
        res.json(data);
    },
    badRequest: (res, data) => {
        res.status(400).json(data);
    },
    notFound: (res, data) => {
        res.status(404).json(data);
    },
    error: (res, data) => {
        res.status(500).json(data);
    },
};

exports.customValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            param: error.param,
            message: error.msg
        };
    }
});

exports.saveErrorLog = err => {
    logger.error(err);
};

exports.dbCurrentDateTime = () => {
    return moment().format(constants.dbDateTimeFormat);
};

exports.readFileContent = async (filename) => {
    const that = this;

    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (fsErr, data) => {
            if (fsErr) {
                that.saveErrorLog(fsErr);
                reject(fsErr);
            }

            resolve(data);
        });
    });
};

exports.mailTransporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.ssl,
    auth: {
        user: config.smtp.username,
        pass: config.smtp.password
    },
    tls: {
        rejectUnauthorized: false
    }
});