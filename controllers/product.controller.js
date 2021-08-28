const {
    body,
    param,
    validationResult
} = require('express-validator');
const mongoose = require('mongoose');
const generalHelper = require('../helpers/general.helper');
const Product = require('../models/product.model');
const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('insurance')
                    .notEmpty()
                    .withMessage('Insurance is required'),
                body('seq')
                    .notEmpty()
                    .withMessage('Sequence is required'),
                body('productType')
                    .notEmpty()
                    .withMessage('Product type is required'),
                body('name')
                    .notEmpty()
                    .withMessage('Name is required'),
                body('config')
                    .notEmpty()
                    .withMessage('Config is required')
            ]
        case 'update':
            return [
                param('productId')
                    .notEmpty()
                    .withMessage('Product ID is required'),
                body('insurance')
                    .notEmpty()
                    .withMessage('Insurance is required'),
                body('seq')
                    .notEmpty()
                    .withMessage('Sequence is required'),
                body('productType')
                    .notEmpty()
                    .withMessage('Product type is required'),
                body('name')
                    .notEmpty()
                    .withMessage('Name is required'),
                body('config')
                    .notEmpty()
                    .withMessage('Config is required')
            ]
        case 'findById':
            return [
                param('productId')
                    .notEmpty()
                    .withMessage('Product ID is required')
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

        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            insurance: req.body.insurance,
            seq: req.body.seq,
            productType: req.body.productType,
            name: req.body.name,
            config: req.body.config
        });

        product.save()
            .then(data => {
                if(!data) return generalHelper.response.error(res, {
                    message: 'Failed to save product data'
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
    Product.find()
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
    
    Product.findOne({_id: req.params.productId})
        .select(fieldsExcluded)
        .populate('insurance')
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Product ID ${req.params.productId} not found`
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

    Product.findOneAndUpdate({_id: req.params.productId}, {
            insurance: req.body.insurance,
            seq: req.body.seq,
            productType: req.body.productType,
            name: req.body.name,
            config: req.body.config
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