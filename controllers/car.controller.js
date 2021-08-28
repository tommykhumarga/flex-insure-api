const {
    body,
    param,
    validationResult
} = require('express-validator');
const generalHelper = require('./../helpers/general.helper');
const {carModel: Car} = require('./../models/car.model');
const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
                body('cars')
                    .notEmpty()
                    .withMessage('Cars is required')
            ]
        case 'update':
            return [
                param('carId')
                    .notEmpty()
                    .withMessage('Car ID is required'),
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
                body('cars')
                    .notEmpty()
                    .withMessage('Cars is required')
            ]
        case 'findOne':
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
            insuranceId: req.body.insuranceId,
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

exports.findOne = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: appError.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });
    
    Car.findById(req.params.insuranceId)
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Car ID ${req.params.insuranceId} not found`
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

    Insurance.findByIdAndUpdate(req.params.carId, {
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