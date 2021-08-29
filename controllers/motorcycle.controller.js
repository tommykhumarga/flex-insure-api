const {
    body,
    param,
    validationResult
} = require('express-validator');
const mongoose = require('mongoose');
const generalHelper = require('../helpers/general.helper');
const Motorcycle = require('../models/motorcycle.model');
const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('insurance')
                    .notEmpty()
                    .withMessage('Insurance is required'),
                body('motorcycles')
                    .notEmpty()
                    .withMessage('Motorcycles is required')
            ]
        case 'update':
            return [
                param('motorcycleId')
                    .notEmpty()
                    .withMessage('Motorcycle ID is required'),
                body('insurance')
                    .notEmpty()
                    .withMessage('Insurance is required'),
                body('motorcycles')
                    .notEmpty()
                    .withMessage('Motorcycles is required')
            ]
        case 'findById':
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
            message: appError.isEmpty.message,
            errors: generalHelper.customValidationResult(req).array()
        });

        const motorcycle = new Motorcycle({
            _id: new mongoose.Types.ObjectId(),
            insurance: req.body.insurance,
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

exports.findById = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: appError.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });
    
    Motorcycle.findOneAndUpdate({_id: req.params.motorcycleId})
        .select(fieldsExcluded)
        .populate('insurance', ['name'])
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Motorcycle ID ${req.params.motorcycleId} not found`
            });

            return generalHelper.response.error(res, {
                message: err.message
            });
        });
};

exports.update = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: appError.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });

    Motorcycle.findOneAndUpdate({_id: req.params.motorcycleId}, {
            motorcycles: req.body.motorcycles
        }, {
            new: true
        })
        .select(fieldsExcluded)
        .then(data => {
            if (!data) return generalHelper.response.notFound(res, {
                message: appError.dataNotFound.message
            });

            generalHelper.response.success(res, data)
        })
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: appError.dataNotFound.message
            });

            return generalHelper.response.error(res, {
                message: err.message
            });
        });
};