const {Schema, model} = require('mongoose');
const {collectionName: InsuranceCollectionName} = require('./insurance.model');

exports.collectionName = 'agent';

const imageObj = {
    socialId: {
        required: {
            type: Boolean,
            default: false
        },
        base64: {
            type: String,
            trim: true,
            default: null
        }
    },
    taxId: {
        required: {
            type: Boolean,
            default: false
        },
        base64: {
            type: String,
            trim: true,
            default: null
        }
    },
    selfie: {
        required: {
            type: Boolean,
            default: false
        },
        base64: {
            type: String,
            trim: true,
            default: null
        }
    }
};

const configObj = {
    refNo: {
        type: String,
        trim: true
    },
    commission: {
        type: Number,
        default: 0
    },
    top: {
        type: Number,
        default: 0
    },
    additionalCommission: {
        type: Number,
        default: 0
    },
    images: imageObj
};

const insuranceObj = {
    insuranceId: {
        type: Schema.Types.ObjectId,
        ref: InsuranceCollectionName
    }
};

const agentSchema = Schema({
    name: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    mobileNo: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    socialId: {
        type: String,
        trim: true
    },
    taxId: {
        type: String,
        trim: true
    },
    insuranceId: {
        type: Schema.Types.ObjectId,
        ref: InsuranceCollectionName
    },
    contactPerson: {
        type: String,
        trim: true
    },
    isCorporate: {
        type: Boolean,
        default: false
    },
    insurances: insuranceObj,
    active: {
        type: Boolean,
        default: false
    },
    config: configObj
}, {
    collection: this.collectionName,
    timestamps: true
});

exports.agentModel = model(this.collectionName, agentSchema);