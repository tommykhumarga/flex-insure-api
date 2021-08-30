import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { collectionName, UserModel } from './../models/user.model';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    let { email, name } = req.body;

    const user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        email,
        name
    });

    try {
        const result = await user.save();
        return res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error
        });
    }
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    UserModel.find()
        .exec()
        .then((results) => {
            return res.status(200).json({
                users: results,
                count: results.length
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { createUser, getAllUsers };
