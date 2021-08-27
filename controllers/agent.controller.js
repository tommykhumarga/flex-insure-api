const {
    body,
    param,
    validationResult
} = require('express-validator');
const generalHelper = require('./../helpers/general.helper');
const {agentModel: Agent} = require('./../models/agent.model');
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
                body('mobileNo')
                    .notEmpty()
                    .withMessage('Mobile number is required')
                    .isMobilePhone()
                    .withMessage('Invalid mobile number format'),
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
                    .withMessage('Invalid boolean format'),
                body('config.refNo', 'Ref. number is required').notEmpty(),
                body('config.commission')
                    .notEmpty()
                    .withMessage('Commission is required')
                    .isNumeric()
                    .withMessage('Commision only use number'),
                body('config.top')
                    .notEmpty()
                    .withMessage('Term of payment is required')
                    .isNumeric()
                    .withMessage('Term of payment only use number'),
                body('config.additionalCommission')
                    .notEmpty()
                    .withMessage('Additional commission is required')
                    .isNumeric()
                    .withMessage('Additional commission only use number')
            ]
        case 'update':
            return [
                param('agentId', 'Agent ID is required').notEmpty(),
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
                    .withMessage('Invalid boolean format'),
                body('config.refNo', 'Ref. number is required').notEmpty(),
                body('config.commission')
                    .notEmpty()
                    .withMessage('Commission is required')
                    .isNumeric()
                    .withMessage('Commision only use number'),
                body('config.top')
                    .notEmpty()
                    .withMessage('Term of payment is required')
                    .isNumeric()
                    .withMessage('Term of payment only use number'),
                body('config.additionalCommission')
                    .notEmpty()
                    .withMessage('Additional commission is required')
                    .isNumeric()
                    .withMessage('Additional commission only use number')
            ]
        case 'findOne':
            return [
                param('agentId', 'Agent ID is required').notEmpty(),
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

        const agent = new Agent({
            name: req.body.name,
            address: req.body.address,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            socialId: req.body.socialId,
            taxId: req.body.taxId,
            insuranceId: req.body.insuranceId,
            contactPerson: req.body.contactPerson,
            isCorporate: req.body.isCorporate,
            insurances: req.body.insurances,
            active: req.body.active,
            config: req.body.config
        });

        agent.save()
            .then(data => {
                if(!data) return generalHelper.response.error(res, {
                    message: 'Failed to save agent data'
                });

                generalHelper.response.success(res, data);
            })
            .catch(err => {
                console.log(err);
                generalHelper.saveErrorLog(err);
                generalHelper.response.error(res, {
                    message: err.message
                });
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
    Agent.find()
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
    
    Agent.findById(req.params.insuranceId)
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Agent ID ${req.params.insuranceId} not found`
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

    Insurance.findByIdAndUpdate(req.params.agentId, {
            name: req.body.name,
            address: req.body.address,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
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