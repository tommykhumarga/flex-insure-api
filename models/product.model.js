const {Schema, model} = require('mongoose');
const {collectionName: InsuranceCollectionName} = require('./insurance.model');

exports.collectionName = 'product';

const configObj = {
    description: {
        type: String,
        trim: true
    }
};

const productSchema = Schema({
    insuranceId: {
        type: Schema.Types.ObjectId,
        ref: InsuranceCollectionName
    },
    seq: {
        type: Number,
        default: 0
    }
})