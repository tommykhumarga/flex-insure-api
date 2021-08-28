const {Schema, model} = require('mongoose');
const {collectionName: InsuranceCollectionName} = require('./insurance.model');
const {collectionName: UserCollectionName} = require('./user.model');

exports.collectionName = 'insured';

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

const insuranceObj = {
    insuranceId: {
        type: Schema.Types.ObjectId,
        ref: InsuranceCollectionName
    }
};

const configObj = {
    images: imageObj
};

const insuredSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: UserCollectionName
    },
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
        trim: true,
        unique: [true, 'Mobile number already exist']
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'Email address already exist']
    },
    socialId: {
        type: String,
        trim: true
    },
    drivingId: {
        type: String,
        trim: true
    },
    taxId: {
        type: String,
        trim: true
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

exports.insuredModel = model(this.collectionName, insuredSchema);