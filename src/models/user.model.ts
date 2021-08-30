import mongoose, { Schema } from 'mongoose';
import IUser from './../interfaces/user.interface';

export const collectionName = 'user';

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        }
    },
    {
        collection: 'user',
        timestamps: true
    }
);

export const UserModel = mongoose.model<IUser>(collectionName, UserSchema);
