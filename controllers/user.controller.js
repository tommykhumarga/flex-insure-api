const appRootPath = require('app-root-path');
const {
    body,
    param,
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const {
    v4: uuidv4
} = require('uuid');
const moment = require('moment');
const config = require('./../config/config');
const constants = require('./../config/constants');
const generalHelper = require('./../helpers/general.helper');
const encryptionHelper = require('./../helpers/encryption.helper');
const {userModel: User} = require('./../models/user.model');

const fieldsExcluded = '-__v -password -activationToken';

exports.validate = (method) => {
    switch (method) {
        case 'register':
            return [
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format'),
                body('password')
                .notEmpty()
                    .withMessage('Password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password should be 6 - 30 characters long'),
                body('name')
                .notEmpty()
                    .withMessage('Name is required'),
                body('mobileNo')
                    .notEmpty()
                    .withMessage('Mobile number is required')
                    .isMobilePhone()
                    .withMessage('Invalid phone number format')
            ];
        case 'activation':
        case 'validateForgotPasswordToken':
            return [
                body('token', 'Token is required').not().isEmpty()
            ]
        case 'login':
            return [
                body('email', 'Email').not().isEmpty(),
                body('password')
                    .notEmpty()
                    .withMessage('Password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password must be 6 - 30 characters')
            ]
        case 'findOne':
            return [
                param('userId')
                    .notEmpty()
                    .withMessage('User ID is required')
            ]
        case 'changePassword':
            return [
                param('userId')
                    .notEmpty()
                    .withMessage('User ID is required'),
                body('password')
                    .notEmpty()
                    .withMessage('Password is required'),
                body('newPassword')
                    .notEmpty()
                    .withMessage('New password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password must be 6 - 30 characters'),
                body('confirmNewPassword')
                    .custom((value, {req}) => {
                        if(value !== req.body.newPassword) throw new Error('Password confirmation does not match password');
                    })
            ]
        case 'update':
            return [
                param('userId')
                    .notEmpty()
                    .withMessage('User ID is required'),
                body('name')
                    .notEmpty()
                    .withMessage('Name is required'),
                body('role')
                    .notEmpty()
                    .withMessage('Role is required'),
                body('mobileNo')
                    .notEmpty()
                    .withMessage('Mobile number is required')
                    .isMobilePhone()
                    .withMessage('Invalid phone number format'),
                body('type', 'Type is required')
                    .notEmpty(),
                body('authenticationMethod', 'Authentication method is required')
                    .notEmpty(),
                body('active', 'Active is required')
                    .notEmpty()
            ]
        case 'create':
            return [
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format'),
                body('password')
                    .notEmpty()
                    .withMessage('Password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password must be 6 - 30 characters'),
                body('role')
                    .notEmpty()
                    .withMessage('Role is required'),
                body('name')
                    .notEmpty()
                    .withMessage('Name is required'),
                body('mobileNo')
                    .notEmpty()
                    .withMessage('Mobile number is required')
                    .isMobilePhone()
                    .withMessage('Invalid phone number format'),
                body('type', 'Type is required')
                    .notEmpty(),
                body('authenticationMethod', 'Authentication method is required')
                    .notEmpty()
            ];
        case 'forgotPassword':
            return [
                body('email')
                    .notEmpty()
                    .withMessage('Email is required')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Invalid email address format')
            ]
        case 'resetPassword':
            return [
                param('userId')
                    .notEmpty()
                    .withMessage('User ID is required'),
                body('newPassword')
                    .notEmpty()
                    .withMessage('New password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password must be 6 - 30 characters'),
                body('confirmNewPassword')
                    .custom((value, {req}) => {
                        if(value !== req.body.newPassword) throw new Error('Password confirmation does not match password');
                    })
            ]
    }
};

exports.register = async(req, res) => {
    try {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
            message: fiErrors.isEmpty.message,
            errors: generalHelper.customValidationResult(req).array()
        });

        const hashedPassword = encryptionHelper.encrypt(req.body.password);
        const activationToken = uuidv4();
        const activationTokenExpiry = moment().add(1, 'hours');

        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            mobileNo: req.body.mobileNo,
            authenticationMethod: constants.userAuth.low.value,
            type: constants.userTypes.none.value,
            role: 'user',
            activationToken,
            activationTokenExpiry
        });

        const save = await user.save();
        if (!save) return generalHelper.responseJson(res, {
            message: 'Registration failed'
        });

        const hashedActivationToken = encryptionHelper.cryptoEncrypt(activationToken);
        const activationLink = `${config.webapp.baseUrl}${config.webapp.activationPath}?token=${hashedActivationToken}`;
        let emailBody = await generalHelper.readFileContent(`${appRootPath}/templates/registration.txt`);
        emailBody = emailBody.replace('##LINK##', activationLink);

        generalHelper.mailTransporter.sendMail({
            from: 'FlexInsure <noreply@webpreview.xyz>',
            to: req.body.email,
            subject: 'FlexInsure Registration',
            html: emailBody
        }).then(response => {
            generalHelper.response.success(res, {
                message: 'Activation token has been sent to your inbox. Activation token only valid for 1 hour'
            });
        }).catch(err => {
            generalHelper.saveErrorLog(err);
            generalHelper.response.error(res, {
                message: 'Failed to send activation token to your inbox, please login and resend the activation token again'
            });
        });
    } catch (err) {
        generalHelper.saveErrorLog(err);
        return generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.activation = async(req, res) => {
    try {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
            message: fiErrors.isEmpty.message,
            errors: generalHelper.customValidationResult(req).array()
        });

        const token = encryptionHelper.cryptoDecrypt(req.body.token);
        const userData = await User.findOne({
            activationToken: token
        });

        if (!userData) return generalHelper.response.error(res, {
            message: fiErrors.invalidToken.message
        });

        if (moment(userData.activationTokenExpiry).isBefore(moment())) return generalHelper.response.error(res, {
            message: fiErrors.tokenExpired.message
        });

        const activate = await User.findByIdAndUpdate(userData._id, {
            active: true,
            activationToken: null,
            activationTokenExpiry: null
        });

        if (!activate) return generalHelper.response.error(res, {
            message: 'Failed to activate user, please contact administrator'
        });

        generalHelper.response.success(res, {
            message: 'User activated successfully'
        });
    } catch (err) {
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.login = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });

    User.findOne({
            email: req.body.email
        })
        .then(data => {
            if (!data) return generalHelper.response.error(res, {
                message: 'Email not found'
            });

            if (!encryptionHelper.compare(req.body.password, data.password)) return generalHelper.response.error(res, {
                message: 'Invalid login'
            });

            jwt.sign({
                    id: data._id,
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    type: data.type,
                    authenticationMethod: data.authenticationMethod
                },
                config.encryption.jwtKey, {
                    expiresIn: '1d'
                }, (err, token) => {
                    if (err) return generalHelper.response.error(res, {
                        message: err.message
                    });

                    generalHelper.response.success(res, {
                        id: data._id,
                        token
                    });
                })
        })
        .catch(err => {
            generalHelper.saveErrorLog(err);
            return generalHelper.response.error(res, {
                message: err.message
            });
        });
};

exports.changePassword = async(req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });

    try {
        const userData = await User.findOne({
            _id: req.params.userId
        });

        if (!userData) return generalHelper.response.error(res, {
            message: fiErrors.dataNotFound.message
        });

        if (!encryptionHelper.compare(req.body.currentPassword, userData.password)) return generalHelper.response.error(res, {
            message: 'Password did not match'
        });

        const hashedNewPassword = encryptionHelper.encrypt(req.body.newPassword);
        const updatePassword = await User.findByIdAndUpdate(req.params.userId, {
            password: hashedNewPassword,
            forgotPasswordToken: null,
            forgotPasswordTokenExpiry: null
        });

        if (!updatePassword) return generalHelper.response.error(res, {
            message: 'Failed to change user password'
        });

        generalHelper.response.success(res, {
            message: 'User password changed successfully'
        });
    } catch (err) {
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.forgotPassword = async(req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });

    try {
        const userData = await User.findOne({email: req.body.email});
        if(!userData) return generalHelper.response.badRequest(res, {
            message: fiErrors.dataNotFound.message
        });

        const forgotPasswordToken = uuidv4();
        const forgotPasswordTokenExpiry = moment().add(1, 'hours');
        const updateUser = await User.findByIdAndUpdate(userData._id, {
            forgotPasswordToken,
            forgotPasswordTokenExpiry
        });
        if(!updateUser) return generalHelper.response.error(res, {
            message: 'Failed to create reset link'
        });

        const hashedForgotPasswordToken = encryptionHelper.cryptoEncrypt(forgotPasswordToken);
        const resetLink = `${config.webapp.baseUrl}${config.webapp.forgotPasswordPath}?validate&token=${hashedForgotPasswordToken}`;
        let emailBody = await generalHelper.readFileContent(`${appRootPath}/templates/forgot_password.txt`);
        emailBody = emailBody.replace('##LINK##', resetLink);

        generalHelper.mailTransporter.sendMail({
            from: 'FlexInsure <noreply@webpreview.xyz>',
            to: req.body.email,
            subject: 'FlexInsure Reset Password',
            html: emailBody
        }).then(response => {
            generalHelper.response.success(res, {
                message: 'Reset password link has been sent to your inbox. Reset password link only valid for 1 hour'
            });
        }).catch(err => {
            generalHelper.saveErrorLog(err);
            generalHelper.response.error(res, {
                message: 'Failed to send reset password link to your inbox. Please contact administrator'
            });
        });
    } catch (err) {
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.validateForgotPasswordToken = async(req, res) => {
    try {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
            message: fiErrors.isEmpty.message,
            errors: generalHelper.customValidationResult(req).array()
        });

        const token = encryptionHelper.cryptoDecrypt(req.body.token);
        User.findOne({
                forgotPasswordToken: token
            })
            .select('-password')
            .then(data => {
                if (!data) return generalHelper.response.error(res, {
                    message: fiErrors.invalidToken.message
                });
            
                if (moment(data.activationTokenExpiry).isBefore(moment())) return generalHelper.response.error(res, {
                    message: fiErrors.tokenExpired.message
                });

                generalHelper.response.success(res, {
                    message: '',
                    data
                });
            })
            .catch(err => {
                generalHelper.saveErrorLog(err);
                generalHelper.response.error(res, {
                    message: err.message
                });
            });
    } catch (err) {
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.resetPassword = async(req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });

    try {
        const userData = await User.findOne({
            _id: req.params.userId
        });

        if (!userData) return generalHelper.response.error(res, {
            message: fiErrors.dataNotFound.message
        });

        const hashedNewPassword = encryptionHelper.encrypt(req.body.newPassword);
        const updatePassword = await User.findByIdAndUpdate(req.params.userId, {
            password: hashedNewPassword,
            forgotPasswordToken: null,
            forgotPasswordTokenExpiry: null
        });

        if (!updatePassword) return generalHelper.response.error(res, {
            message: 'Failed to change user password'
        });

        generalHelper.response.success(res, {
            message: 'User password changed successfully'
        });
    } catch (err) {
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, {
            message: err.message
        });
    }
};

exports.create = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });
    
    let hashedPassword;

    try {
        hashedPassword = encryptionHelper.encrypt(req.body.password);
    } catch (err) {
        return generalHelper.response.error(res, err.message);
    }

    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        name: req.body.name,
        mobileNo: req.body.mobileNo,
        authenticationMethod: req.body.authenticationMethod,
        type: req.body.type
    });

    user.save()
        .then(data => {
            if(!data) return generalHelper.response.error(res, {
                message: 'Failed to save user data'
            });

            generalHelper.response.success(res, data);
        })
        .catch(err => {
            generalHelper.saveErrorLog(err);

            if(err.code === 11000) {
                let errMessage;
                const key = Object.keys(err.keyValue)[0];

                if(key === 'mobileNo') errMessage = fiErrors.mobileNumberExist
                if(key === 'email') errMessage = fiErrors.emailExist;

                generalHelper.response.error(res, errMessage);
            } else {
                generalHelper.response.error(res, errMessage);
            }
        });
};

exports.findAll = (req, res) => {
    User.find()
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            generalHelper.response.error(res, {
                message: err.message
            });
        });
};

exports.findOne = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });
    
    User.findById(req.params.userId)
        .select(fieldsExcluded)
        .then(data => generalHelper.response.success(res, data))
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: `User ID ${req.params.userId} not found`
            });

            return generalHelper.response.error(res, {
                message: err.message
            });
        });
};

exports.update = (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return generalHelper.response.badRequest(res, {
        message: fiErrors.isEmpty.message,
        errors: generalHelper.customValidationResult(req).array()
    });

    User.findByIdAndUpdate(req.params.userId, {
            role: req.body.role,
            name: req.body.name,
            mobileNo: req.body.mobileNo,
            type: req.body.type,
            authenticationMethod: req.body.authenticationMethod,
            active: req.body.active
        }, {
            new: true
        })
        .select(fieldsExcluded)
        .then(data => {
            if (!data) return generalHelper.response.notFound(res, {
                message: fiErrors.dataNotFound.message
            });

            generalHelper.response.success(res, data)
        })
        .catch(err => {
            generalHelper.saveErrorLog(err);
            if (err.kind === 'ObjectId') return generalHelper.response.notFound(res, {
                message: fiErrors.dataNotFound.message
            });

            return generalHelper.response.error(res, {
                message: err.message
            });
        });
};

exports.testEmail = async(req, res) => {
    let emailBody;

    try {
        emailBody = await generalHelper.readFileContent(`${appRootPath}/templates/registration.txt`);
        emailBody = emailBody.replace('##LINK##', 'https://www.detik.com');
    } catch (err) {
        generalHelper.saveErrorLog(err);
    }

    generalHelper.mailTransporter.sendMail({
        from: 'FlexInsure <noreply@webpreview.xyz>',
        to: req.body.to,
        subject: 'FlexInsure Registration',
        html: emailBody
    }).then(response => {
        generalHelper.response.success(res, response);
    }).catch(err => {
        generalHelper.saveErrorLog(err);
        generalHelper.response.error(res, err);
    });
}