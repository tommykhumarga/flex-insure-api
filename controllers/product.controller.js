const {
    body,
    param,
    validationResult
} = require('express-validator');
const generalHelper = require('../helpers/general.helper');
const {productModel: Product} = require('../models/product.model');
const fieldsExcluded = '-__v';

exports.validate = (method) => {
    switch(method) {
        case 'create':
            return [
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
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
                body('insuranceId')
                    .notEmpty()
                    .withMessage('Insurance ID is required'),
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
        case 'findOne':
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
            insuranceId: req.body.insuranceId,
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

exports.findOne = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: appError.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });
    
    Product.findById(req.params.insuranceId)
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `Product ID ${req.params.insuranceId} not found`
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

    Insurance.findByIdAndUpdate(req.params.productId, {
            products: req.body.products
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