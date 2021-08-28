const {Schema, model} = require('mongoose');
const dbCollections = require('./collections');

const configObj = {
    logo: {
        type: String,
        trim: true
    },
    fileStorage: {
        type: {
            type: String,
            trim: true,
            default: 'oss'
        },
        endpoint: {
            type: String,
            trim: true
        },
        key: {
            type: String,
            trim: true
        },
        secret: {
            type: String,
            trim: true
        }
    },
    agent: {
        tcFile: {
            type: String,
            trim: true
        }
    },
    // carRecognition: {
    //     active: {
    //         type: Boolean,
    //         default: false
    //     },
    //     make: {
    //         threshold: {
    //             type: Number,
    //             default: 0
    //         },
    //         active: {
    //             type: Boolean,
    //             default: false
    //         }
    //     },
    //     model: {
    //         threshold: {
    //             type: Number,
    //             default: 0
    //         },
    //         active: {
    //             type: Boolean,
    //             default: false
    //         }
    //     },
    //     color: {
    //         threshold: {
    //             type: Number,
    //             default: 0
    //         },
    //         active: {
    //             type: Boolean,
    //             default: false
    //         }
    //     }
    // },
    // faceRecognition: {
    //     active: {
    //         type: Boolean,
    //         default: false
    //     },
    //     threshold: {
    //         type: Number,
    //         default: 75
    //     }
    // },
    // carDamageRecognition: {
    //     active: {
    //         type: Boolean,
    //         default: false
    //     },
    //     threshold: {
    //         type: Number,
    //         default: 75
    //     }
    // },
    smtp: {
        server: {
            type: String,
            trim: true
        },
        port: {
            type: Number
        },
        secure: {
            type: Boolean
        },
        username: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            trim: true
        }
    }
};

const insuranceSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    phoneNo: {
        type: String,
        trim: true,
        required: true
    },
    pic: {
        type: String,
        trim: true,
        required: true
    },
    taxId: {
        type: String,
        trim: true,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    approvalRemarks: {
        type: String,
        trim: true
    },
    activationToken: {
        type: String,
        trim: true,
        default: null
    },
    activationTokenExpiry: {
        type: Date,
        default: null
    },
    config: configObj
}, {
    collection: dbCollections.insurance.name
});

module.exports = model(dbCollections.insurance.name, insuranceSchema);