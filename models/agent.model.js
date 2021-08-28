const {Schema, model} = require('mongoose');
const dbCollections = require('./collections');

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

const agentSchema = Schema({
    _id: Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        ref: dbCollections.user.name
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
    contactPerson: {
        type: String,
        trim: true
    },
    isCorporate: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    config: configObj
}, {
    collection: dbCollections.agent.name
});

module.exports = model(dbCollections.agent.name, agentSchema);