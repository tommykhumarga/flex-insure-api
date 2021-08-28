const {
    body,
    param,
    validationResult
} = require('express-validator');
const mongoose = require('mongoose');
const generalHelper = require('./../helpers/general.helper');
const Car = require('./../models/car.model');
const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('insurance')
                    .notEmpty()
                    .withMessage('Insurance is required'),
                body('cars')
                    .notEmpty()
                    .withMessage('Cars is required')
            ]
        case 'update':
            return [
                param('carId')
                    .notEmpty()
                    .withMessage('Car ID is required'),
                body('insurance')
                    .notEmpty()
                    .withMessage('Insurance is required'),
                body('cars')
                    .notEmpty()
                    .withMessage('Cars is required')
            ]
        case 'findById':
            return [
                param('carId')
                    .notEmpty()
                    .withMessage('Car ID is required')
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

        const car = new Car({
            _id: new mongoose.Types.ObjectId(),
            insurance: req.body.insurance,
            cars: req.body.cars
        });

        car.save()
            .then(data => {
                if(!data) return generalHelper.response.error(res, {
                    message: 'Failed to save car data'
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
    Car.find()
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
    
    Car.findOne({_id: req.params.carId})
        .select(fieldsExcluded)
        .populate('insurance', ['name'])
        .then(data => {
            generalHelper.response.success(res, data)
        })
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Car ID ${req.params.carId} not found`
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

    Car.findOneAndUpdate({_id: req.params.carId}, {
            cars: req.body.cars
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