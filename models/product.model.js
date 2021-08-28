const {Schema, model} = require('mongoose');
const {collectionName: InsuranceCollectionName} = require('./insurance.model');

exports.collectionName = 'product';

const approverObj = {
    tsi: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        }
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: false
    }
};

const feeObj = {
    refCode: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        default: 0
    }
};

const loadingRateObj = {
    startAge: {
        type: Number,
        default: 0
    },
    endAge: {
        type: Number,
        default: 0
    },
    rate: {
        type: Number,
        default: 0
    }
};

const progressiveRateObj = {
    startTsi: {
        type: Number,
    },
    endTsi: {
        type: Number,
    },
    rate: {
        type: Number
    }
};

const coverageDataObj = {
    seq: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    refCode: {
        type: String,
        trim: true
    },
    isMain: {
        type: Boolean,
        default: false
    },
    multiplyByNumPassenger: {
        type: Boolean,
        default: false
    },
    progressive: {
        type: Boolean,
        default: false
    },
    rate: {
        type: Number,
        default: 0
    },
    tsi: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        }
    },
    progressiveRate: [progressiveRateObj]
}

const coverageObj = {
    refCode: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    data: [coverageDataObj]
};

const additionalCoverageDataObj = {
    seq: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    refCode: {
        type: String,
        trim: true
    },
    isMain: {
        type: Boolean,
        default: false
    },
    multiplyByNumPassenger: {
        type: Boolean,
        default: false
    },
    progressive: {
        type: Boolean,
        default: false
    },
    rate: {
        type: Number,
        default: 0
    },
    tsi: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        }
    }
}

const additionalCoverageObj = {
    refCode: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    data: [additionalCoverageDataObj]
}

const configObj = {
    description: {
        type: String,
        trim: true
    },
    attachment: {
        type: String,
        trim: true
    },
    deductible: {
        type: Number,
        default: 0
    },
    claim: {
        numImages: {
            type: Number,
            default: 0
        },
        reportEmail: {
            type: String,
            trim: true
        },
        autoSendSpk: {
            type: Boolean,
            default: false
        }
    },
    quotation: {
        numImages: {
            type: Number,
            default: 0
        },
        requiresApproval: {
            type: Boolean,
            default: false
        },
        tiering: {
            type: Boolean,
            default: false
        },
        approverList: [approverObj]
    },
    fees: [feeObj],
    loadingRate: [loadingRateObj],
    coverages: coverageObj,
    additionalCoverages: additionalCoverageObj
};

const productSchema = Schema({
    insuranceId: {
        type: Schema.Types.ObjectId,
        ref: InsuranceCollectionName
    },
    seq: {
        type: Number,
        default: 0
    },
    productType: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    config: configObj
}, {
    collection: this.collectionName,
    timestamps: true
});

exports.productModel = model(this.collectionName, productSchema);