const {Schema, model} = require('mongoose');
const dbCollections = require('./collections');

const typeObj = {
    name: {
        type: String,
        trim: true
    },
    refCode: {
        type: String,
        trim: true
    }
};

const colorObj = {
    name: {
        type: String,
        trim: true
    },
    refCode: {
        type: String,
        trim: true
    }
};

const modelObj = {
    name: {
        type: String,
        trim: true,
    },
    refCode: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    categoryRefCode: {
        type: String,
        trim: true
    },
    numSeats: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: false
    },
    types: [typeObj],
    colors: [colorObj]
};

const depreciationObj = {
    startYear: {
        type: Number,
        default: 0
    },
    endYear: {
        type: Number,
        default: 0
    },
    rate: {
        type: Number,
        default: 0
    },
    premiumRate: {
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

const brandObj = {
    name: {
        type: String,
        trim: true
    },
    refCode: {
        type: String,
        trim: true
    },
    models: [modelObj],
    depreciation: [depreciationObj],
    loadingRate: [loadingRateObj]
};

const carSchema = Schema({
    _id: Schema.Types.ObjectId,
    insurance: {
        type: Schema.Types.ObjectId,
        ref: dbCollections.insurance.name
    },
    cars: {
        type: [brandObj]
    }
}, {
    collection: dbCollections.car.name
});

module.exports = model(dbCollections.car.name, carSchema);