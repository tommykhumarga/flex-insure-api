import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationChain } from 'express-validator';
import mongoose from 'mongoose';
import { User } from './../../models/user.model';
import generalHelper from './../../helpers/general.helper';
import { errorMessage } from './../../config/enum';

const fieldsExcluded = '-__v -password -activationToken';

const validate = (method: string) => {
    switch (method) {
        case 'register':
            return [
                body('email').notEmpty().withMessage('Email is required').normalizeEmail().isEmail().withMessage('Invalid email address format'),
                body('password')
                    .notEmpty()
                    .withMessage('Password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password should be 6 - 30 characters long'),
                body('name').notEmpty().withMessage('Name is required'),
                body('mobileNo').notEmpty().withMessage('Mobile number is required').isMobilePhone('id-ID').withMessage('Invalid phone number format')
            ];
        case 'activation':
        case 'validateForgotPasswordToken':
            return [body('token', 'Token is required').not().isEmpty()];
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
            ];
        case 'findById':
            return [param('userId').notEmpty().withMessage('User ID is required')];
        case 'changePassword':
            return [
                param('userId').notEmpty().withMessage('User ID is required'),
                body('password').notEmpty().withMessage('Password is required'),
                body('newPassword')
                    .notEmpty()
                    .withMessage('New password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password must be 6 - 30 characters'),
                body('confirmNewPassword').custom((value, { req }) => {
                    if (value !== req.body.newPassword) throw new Error('Password confirmation does not match password');
                })
            ];
        case 'update':
            return [
                param('userId').notEmpty().withMessage('User ID is required'),
                body('name').notEmpty().withMessage('Name is required'),
                body('role').notEmpty().withMessage('Role is required'),
                body('mobileNo').notEmpty().withMessage('Mobile number is required').isMobilePhone('id-ID').withMessage('Invalid phone number format'),
                body('type', 'Type is required').notEmpty(),
                body('authenticationMethod', 'Authentication method is required').notEmpty(),
                body('active', 'Active is required').notEmpty()
            ];
        case 'create':
            return [
                body('email').notEmpty().withMessage('Email is required').normalizeEmail().isEmail().withMessage('Invalid email address format'),
                body('password')
                    .notEmpty()
                    .withMessage('Password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password must be 6 - 30 characters'),
                body('role').notEmpty().withMessage('Role is required'),
                body('name').notEmpty().withMessage('Name is required'),
                body('mobileNo').notEmpty().withMessage('Mobile number is required').isMobilePhone('id-ID').withMessage('Invalid phone number format'),
                body('type', 'Type is required').notEmpty(),
                body('authenticationMethod', 'Authentication method is required').notEmpty()
            ];
        case 'forgotPassword':
            return [body('email').notEmpty().withMessage('Email is required').normalizeEmail().isEmail().withMessage('Invalid email address format')];
        case 'resetPassword':
            return [
                param('userId').notEmpty().withMessage('User ID is required'),
                body('newPassword')
                    .notEmpty()
                    .withMessage('New password is required')
                    .isLength({
                        min: 6,
                        max: 30
                    })
                    .withMessage('Password must be 6 - 30 characters'),
                body('confirmNewPassword').custom((value, { req }) => {
                    if (value !== req.body.newPassword) throw new Error('Password confirmation does not match password');
                })
            ];
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        return generalHelper.response.badRequest(res, {
            message: errorMessage.BAD_REQUEST,
            errors: generalHelper.customValidationResult(req).array()
        });

    let { email, name } = req.body;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        name
    });

    try {
        const result = await user.save();
        return res.status(200).json(result);
    } catch (error: any) {
        generalHelper.saveErrorLog(error);
        generalHelper.response.error(res, {
            message: error.message,
            error
        });
    }
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select(fieldsExcluded)
        .then((results) => generalHelper.response.success(res, results))
        .catch((error) => {
            generalHelper.saveErrorLog(error);
            generalHelper.response.error(res, {
                message: error.message,
                error
            });
        });
};

export default { validate, createUser, getAllUsers };
