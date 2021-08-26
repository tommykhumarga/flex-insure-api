const appRootPath = require('app-root-path');
const {
    body,
    param,
    validationResult
} = require('express-validator');
const moment = require('moment');
const config = require('./../config/config');
const constants = require('./../config/constants');
const generalHelper = require('./../helpers/general.helper');
const Insurance = require('./../models/insurance.model');

const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('name', 'Name is required').notEmpty(),
                body('address', 'Address is required').notEmpty(),
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format'),
                body('phoneNo')
                    .notEmpty()
                    .withMessage('Phone number is required')
                    .isMobilePhone()
                    .withMessage('Invalid mobile number format'),
                body('pic', 'Person in Charge is required').notEmpty(),
                body('taxId')
                    .notEmpty()
                    .withMessage('Tax ID is required')
                    .isLength({
                        min: 15,
                        max: 15
                    })
                    .withMessage('Tax ID should be 15 characters long'),
                body('active')
                    .notEmpty()
                    .withMessage('Active is required')
                    .isBoolean()
                    .withMessage('Invalid boolean format'),
                body('config.logo', 'Logo is required').notEmpty(),
                body('config.fileStorage.endpoint', 'File storage endpoint is required').notEmpty(),
                body('config.fileStorage.key', 'File storage access key is required').notEmpty(),
                body('config.fileStorage.secret', 'File storage secret key is required').notEmpty(),
                body('config.agent.tcFile', 'Agent terms & condition template is required').notEmpty(),
                body('config.smtp.server', 'SMTP server is required').notEmpty(),
                body('config.smtp.port', 'SMTP port is required').notEmpty(),
                body('config.smtp.secure', 'SMTP secure is required').notEmpty(),
                body('config.smtp.username', 'SMTP username is required').notEmpty(),
                body('config.smtp.password', 'SMTP password is required').notEmpty()
            ]
        case 'update':
            return [
                param('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
                body('name', 'Name is required').notEmpty(),
                body('address', 'Address is required').notEmpty(),
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format'),
                body('phoneNo')
                    .notEmpty()
                    .withMessage('Phone number is required')
                    .isMobilePhone()
                    .withMessage('Invalid mobile number format'),
                body('pic', 'Person in Charge is required').notEmpty(),
                body('taxId')
                    .notEmpty()
                    .withMessage('Tax ID is required')
                    .isLength({
                        min: 15,
                        max: 15
                    })
                    .withMessage('Tax ID should be 15 characters long'),
                body('active')
                    .notEmpty()
                    .withMessage('Active is required')
                    .isBoolean()
                    .withMessage('Invalid boolean format'),
                body('config.logo', 'Logo is required').notEmpty(),
                body('config.fileStorage.endpoint', 'File storage endpoint is required').notEmpty(),
                body('config.fileStorage.key', 'File storage access key is required').notEmpty(),
                body('config.fileStorage.secret', 'File storage secret key is required').notEmpty(),
                body('config.agent.tcFile', 'Agent terms & condition template is required').notEmpty(),
                body('config.smtp.server', 'SMTP server is required').notEmpty(),
                body('config.smtp.port', 'SMTP port is required').notEmpty(),
                body('config.smtp.secure', 'SMTP secure is required').notEmpty(),
                body('config.smtp.username', 'SMTP username is required').notEmpty(),
                body('config.smtp.password', 'SMTP password is required').notEmpty()
            ]
        case 'register':
            return [
                body('name', 'Name is required').notEmpty(),
                body('address', 'Address is required').notEmpty(),
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format'),
                body('phoneNo')
                    .notEmpty()
                    .withMessage('Phone number is required')
                    .isMobilePhone()
                    .withMessage('Invalid mobile number format'),
                body('pic', 'Person in Charge is required').notEmpty(),
                body('taxId')
                    .notEmpty()
                    .withMessage('Tax ID is required')
                    .isLength({
                        min: 15,
                        max: 15
                    })
                    .withMessage('Tax ID should be 15 characters long'),
                body('config.logo', 'Logo is required').notEmpty(),
                body('config.fileStorage.endpoint', 'File storage endpoint is required').notEmpty(),
                body('config.fileStorage.key', 'File storage access key is required').notEmpty(),
                body('config.fileStorage.secret', 'File storage secret key is required').notEmpty(),
                body('config.agent.tcFile', 'Agent terms & condition template is required').notEmpty(),
                body('config.smtp.server', 'SMTP server is required').notEmpty(),
                body('config.smtp.port', 'SMTP port is required').notEmpty(),
                body('config.smtp.secure', 'SMTP secure is required').notEmpty(),
                body('config.smtp.username', 'SMTP username is required').notEmpty(),
                body('config.smtp.password', 'SMTP password is required').notEmpty()
            ]
        case 'findOne':
            return [
                param('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required')
            ]
    }
}

exports.create = (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
            message: fiErrors.isEmpty.message,
            errors: generalHelper.customValidationResult(req).array()
        });

        const insurance = new Insurance({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            pic: req.body.pic,
            taxId: req.body.pic,
            active: req.body.active,
            config: req.body.config
        });

        insurance.save()
            .then(data => {
                if(!data) return generalHelper.response.error(res, {
                    message: 'Failed to save insurance data'
                });

                generalHelper.response.success(res, {
                    message: 'Insurance data saved successfully'
                });
            })
            .catch(err => {
                generalHelper.saveErrorLog(err);
                generalHelper.response.error(res, {
                    message: err.message
                });
            });
    } catch (err) {
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.findAll = (req, res) => {
    Insurance.find()
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            generalHelper.response.error(res, {
                message: err.message
            });
        });
};

exports.findOne = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });
    
    Insurance.findById(req.params.insuranceId)
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Insurance ID ${req.params.insuranceId} not found`
            });

            return generalHelper.response.error(res, {
                message: err.message
            });
        });
};

exports.update = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });

    Insurance.findByIdAndUpdate(req.params.insuranceId, {
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            pic: req.body.pic,
            taxId: req.body.pic,
            active: req.body.active,
            config: req.body.config
        }, {
            new: true
        })
        .select(fieldsExcluded)
        .then(data => {
            if (!data) return generalHelper.response.notFound(res, {
                message: fiErrors.dataNotFound.message
            });

            generalHelper.response.success(res, data)
        })
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: fiErrors.dataNotFound.message
            });

            return generalHelper.response.error(res, {
                message: err.message
            });
        });
};

// TODO: Kalo nanti mau pake register, ini dibuka terus ditambahin kirim email
// exports.register = (req, res) => {
//     try {
//         const validationErrors = validationResult(req);
//         if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
//             message: fiErrors.isEmpty.message,
//             errors: generalHelper.customValidationResult(req).array()
//         });

//         const insurance = new Insurance({
//             name: req.body.name,
//             address: req.body.address,
//             email: req.body.email,
//             phoneNo: req.body.phoneNo,
//             pic: req.body.pic,
//             taxId: req.body.pic,
//             config: req.body.config
//         });

//         insurance.save()
//             .then(data => {
//                 if(!data) return generalHelper.response.error(res, {
//                     message: 'Failed to save insurance data'
//                 });

//                 generalHelper.response.success(res, {
//                     message: 'Your registration has been saved successfully. An activation link has been sent to insurance email'
//                 });
//             })
//             .catch(err => {
//                 generalHelper.saveErrorLog(err);
//                 generalHelper.response.error(res, {
//                     message: err.message
//                 });
//             });
//     } catch (err) {
//         generalHelper.saveErrorLog(err);
//         generalHelper.response.error(res, {
//             message: err.message
//         });
//     }
// };