import asyncHandler from 'express-async-handler';
import User from '../models/Users.models.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/Auth.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, image } = req.body;
    try {
        const useExists = await User.findOne({ email });
        if (useExists) {
            res.status(400);
            throw new Error('User already exists!');
        } else {
            const salt = bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (!err) {
                            const user = await User.create({
                                fullName,
                                email,
                                password: hash,
                                image
                            });

                            if (user) {
                                res.status(201).json({
                                    _id: user._id,
                                    email: user.email,
                                    fullName: user.fullName,
                                    image: user.image,
                                    isAdmin: user.isAdmin,
                                    token: generateToken(user._id)
                                })
                            } else {
                                res.status(400);
                                throw new Error('Invalid user data');
                            }
                        } else { console.log(err) }
                    })
                } else { console.log(err) }
            })
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { email, fullName, image } = req.body;
    try {
        const user = await User.findById(req.user._id); // user is name of Schema created from Users
        if (user) {
            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.image = image || user.image;

            const updateUser = await user.save();
            res.status(200).json({
                _id: updateUser._id,
                fullName: updateUser.fullName,
                email: updateUser.email,
                image: updateUser.image,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser._id)
            });
        } else {
            res.status(401);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

const deleteUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error("Can't delete admin user");
            } else {
                await User.deleteOne({ _id: user._id });
                res.json({ message: "User deleted successfully" });
            }
        }
        else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const changeUserProfile = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            const updatePassword = await user.save();
            res.status(200).json({message: 'Password changed'});
        } else {
            res.status(401);
            throw new Error('Invalid old password');
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

export {
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUserProfile,
    changeUserProfile
};