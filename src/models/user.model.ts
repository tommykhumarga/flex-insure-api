import { Schema, Model, model, Error } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import { UserType, UserAuth } from './../config/enum';

export interface IUser {
    email: string;
    password: string;
    role: string;
    name: string;
    mobileNo: string;
    type: string;
    authenticationMethod: string;
    blocked: boolean;
    activationToken: string;
    activationTokenExpiry: Date;
    forgotPasswordToken: string;
    forgotPasswordTokenExpiry: Date;
    active: boolean;
    features: object;
}

export const collectionName: string = 'user';

export const userSchema: Schema = new Schema(
    {
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
            enum: UserType,
            required: true
        },
        authenticationMethod: {
            type: String,
            enum: UserAuth,
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
        features: {
            type: Object
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: collectionName,
        timestamps: true
    }
);

userSchema.pre<IUser>('save', function save(next) {
    const user = this;

    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error);

        bcrypt.hash(this.password, salt, (error: Error, hash) => {
            if (error) return next(error);

            user.password = hash;
            next();
        });
    });
});

export const User: Model<IUser> = model<IUser>(collectionName, userSchema);
