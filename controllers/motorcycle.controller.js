const {
    body,
    param,
    validationResult
} = require('express-validator');
const generalHelper = require('../helpers/general.helper');
const {motorcycleModel: Motorcycle} = require('../models/motorcycle.model');
const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
                body('motorcycles')
                    .notEmpty()
                    .withMessage('Motorcycles is required')
            ]
        case 'update':
            return [
                param('motorcycleId')
                    .notEmpty()
                    .withMessage('Motorcycle ID is required'),
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
                body('motorcycles')
                    .notEmpty()
                    .withMessage('Motorcycles is required')
            ]
        case 'findOne':
            return [
                param('motorcycleId')
                    .notEmpty()
                    .withMessage('Motorcycle ID is required')
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

        const motorcycle = new Motorcycle({
            insuranceId: req.body.insuranceId,
            motorcycles: req.body.motorcycles
        });

        motorcycle.save()
            .then(data => {
                if(!data) return generalHelper.response.error(res, {
                    message: 'Failed to save motorcycle data'
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
    Motorcycle.find()
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
    
    Motorcycle.findById(req.params.insuranceId)
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Motorcycle ID ${req.params.insuranceId} not found`
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

    Insurance.findByIdAndUpdate(req.params.motorcycleId, {
            motorcycles: req.body.motorcycles
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