const {Schema, model} = require('mongoose');
const appEnum = require('./../config/enum');

exports.collectionName = 'user';

const userSchema = Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        maxLength: 255,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    mobileNo: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        default: appEnum.userType.none.key
    },
    authenticationMethod: {
        type: String,
        default: appEnum.userAuth.low.key
    },
    blocked: {
        type: Boolean,
        default: false
    },
    activationToken: {
        type: String
    },
    activationTokenExpiry: {
        type: Date
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordTokenExpiry: {
        type: Date
    },
    active: {
        type: Boolean,
        default: false
    }
}, {
    collection: this.collectionName,
    timestamps: true
});

exports.userModel = model(this.collectionName, userSchema);