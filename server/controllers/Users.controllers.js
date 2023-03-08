import asyncHandler from 'express-async-handler';
import UseModel from '../models/Users.models.js';
import bcrypt from 'bcrypt';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, image } = req.body;
    try {
        const useExists = await UseModel.findOne({ email });
        if (useExists) {
            res.status(400);
            throw new Error('User already exists!');
        } else {
            const salt = bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (!err) {
                            res.status(201).json({
                                fullName,
                                email,
                                password: hash,
                                image
                            })
                        } else { console.log(err) }
                    })
                } else { console.log(err) }
            })

        }
    } catch (error) {

    }
});

export { registerUser };

export const a = {}