const mongoose = require('mongoose');
const constants = require('./../config/constants');

let arrUserType = [];

Object.keys(constants.userTypes).forEach((e, i) => {
    arrUserType.push(constants.userTypes[e].value);
});

let arrUserAuth = [];

Object.keys(constants.userAuth).forEach((e, i) => {
    arrUserAuth.push(constants.userAuth[e].value);
});

const UserSchema = mongoose.Schema({
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
        enum: arrUserType,
        required: true
    },
    authenticationMethod: {
        type: String,
        enum: arrUserAuth,
        required: true
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
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);