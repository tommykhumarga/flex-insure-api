const {
    body,
    param,
    validationResult
} = require('express-validator');
const generalHelper = require('../helpers/general.helper');
const {insuredModel: Insured} = require('../models/insured.model');
const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('userId')
                    .notEmpty()
                    .withMessage('User ID is required'),
                body('name', 'Name is required').notEmpty(),
                body('address', 'Address is required').notEmpty(),
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format'),
                body('mobileNo')
                    .notEmpty()
                    .withMessage('Mobile number is required')
                    .isMobilePhone()
                    .withMessage('Invalid mobile number format'),
                body('drivingId')
                    .notEmpty()
                    .withMessage('Driving license ID is required'),
                body('socialId')
                    .notEmpty()
                    .withMessage('Social ID is required')
                    .isLength({
                        min: 16,
                        max: 16
                    })
                    .withMessage('Social ID should be 16 characters long'),
                body('taxId')
                    .notEmpty()
                    .withMessage('Tax ID is required')
                    .isLength({
                        min: 15,
                        max: 15
                    })
                    .withMessage('Tax ID should be 15 characters long'),
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
                body('contactPerson')
                    .notEmpty()
                    .withMessage('Contact person is required'),
                body('isCorporate')
                    .notEmpty()
                    .withMessage('Is corporate is required'),
                body('active')
                    .notEmpty()
                    .withMessage('Active is required')
                    .isBoolean()
                    .withMessage('Invalid boolean format')
            ]
        case 'update':
            return [
                param('insuredId', 'Insured ID is required').notEmpty(),
                body('name', 'Name is required').notEmpty(),
                body('address', 'Address is required').notEmpty(),
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format'),
                body('mobileNo')
                    .notEmpty()
                    .withMessage('Mobile number is required')
                    .isMobilePhone()
                    .withMessage('Invalid mobile number format'),
                body('drivingId')
                    .notEmpty()
                    .withMessage('Driving license ID is required'),
                body('socialId')
                    .notEmpty()
                    .withMessage('Social ID is required')
                    .isLength({
                        min: 16,
                        max: 16
                    })
                    .withMessage('Social ID should be 16 characters long'),
                body('taxId')
                    .notEmpty()
                    .withMessage('Tax ID is required')
                    .isLength({
                        min: 15,
                        max: 15
                    })
                    .withMessage('Tax ID should be 15 characters long'),
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
                body('contactPerson')
                    .notEmpty()
                    .withMessage('Contact person is required'),
                body('isCorporate')
                    .notEmpty()
                    .withMessage('Is corporate is required'),
                body('active')
                    .notEmpty()
                    .withMessage('Active is required')
                    .isBoolean()
                    .withMessage('Invalid boolean format')
            ]
        case 'findOne':
            return [
                param('insuredId', 'Insured ID is required').notEmpty(),
            ]
    }
};

exports.create = (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
            message: fiErrors.isEmpty.message,
            errors: generalHelper.customValidationResult(req).array()
        });

        const insured = new Insured({
            name: req.body.name,
            address: req.body.address,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            drivingId: req.body.drivingId,
            socialId: req.body.socialId,
            taxId: req.body.taxId,
            insuranceId: req.body.insuranceId,
            contactPerson: req.body.contactPerson,
            isCorporate: req.body.isCorporate,
            insurances: req.body.insurances,
            active: req.body.active,
            config: req.body.config
        });

        insured.save()
            .then(data => {
                if(!data) return generalHelper.response.error(res, {
                    message: 'Failed to save insured data'
                });

                generalHelper.response.success(res, data);
            })
            .catch(err => {
                generalHelper.saveErrorLog(err);
                
                if(err.code === 11000) {
                    let errMessage;
                    const key = Object.keys(err.keyValue)[0];
    
                    if(key === 'mobileNo') errMessage = fiErrors.mobileNumberExist
                if(key === 'email') errMessage = fiErrors.emailExist;
    
                    generalHelper.response.error(res, errMessage);
                } else {
                    generalHelper.response.error(res, errMessage);
                }
            });
    } catch (err) {
        console.log(err);
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.findAll = (req, res) => {
    Insured.find()
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
    
    Insured.findById(req.params.insuranceId)
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Insured ID ${req.params.insuranceId} not found`
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

    Insurance.findByIdAndUpdate(req.params.insuredId, {
            name: req.body.name,
            address: req.body.address,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            drivingId: req.body.drivingId,
            socialId: req.body.socialId,
            taxId: req.body.taxId,
            insuranceId: req.body.insuranceId,
            contactPerson: req.body.contactPerson,
            isCorporate: req.body.isCorporate,
            insurances: req.body.insurances,
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