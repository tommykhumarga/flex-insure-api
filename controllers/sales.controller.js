const appRootPath = require('app-root-path');
const {
    body,
    param,
    validationResult
} = require('express-validator');
const {
    v4: uuidv4
} = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const mongoose = require('mongoose');
const generalHelper = require('./../helpers/general.helper');
const User = require('./../models/user.model');
const Insurance = require('./../models/insurance.model');
const Agent = require('./../models/agent.model');
const Product = require('./../models/product.model');
const Car = require('./../models/car.model');
const Motorcycle = require('./../models/motorcycle.model');

const fieldsExcluded = '-__v -password -activationToken';

async function calculate(reqBody) {
    try {
        // Load Data
        const insuranceData = await Insurance.findOne({_id: reqBody.insuranceId}),
            agentData = await Agent.findOne({_id: reqBody.agentId}),
            productData = await Product.findOne({_id: reqBody.productId}),
            productConfig = productData.config,
            productCoverages = productConfig.coverages,
            productCoverageData = _.sortBy(productCoverages.data, ['-isMain', 'seq']);

        // Parameters
        const coverage = reqBody.coverage,
            inceptionStartDate = coverage.startDate,
            yearCoverage = coverage.yearCoverage,
            coverageObj = coverage.object,
            objYear = coverageObj.year,
            objAge = parseInt(moment().format('Y')) - objYear,
            tsi = coverageObj.tsi;

        let isDepreciation = false,
            inceptionEndDate = moment(inceptionStartDate, appEnum.dateFormat.dbDateFormat.value).add(1, 'year').format(appEnum.dateFormat.dbDateFormat.value),
            totalPremium = 0,
            result = {};

        productCoverageData.forEach(e => {
            console.log(tsi * (e.rate / 100));
            totalPremium += (tsi * (e.rate / 100));
        });

        result = {
            product: {
                name: productData.name
            },
            coverage: {
                tsi,
                totalPremium
            }
        };
        return result;
    } catch (err) {
        generalHelper.saveErrorLog(err);
        throw new Error(err);
    }
}

exports.test = async (req, res) => {
    try {
        const result = await calculate(req.body);
        generalHelper.response.success(res, result);
    } catch (err) {
        generalHelper.response.error(res, {
            message: err.message
        });
    }
}