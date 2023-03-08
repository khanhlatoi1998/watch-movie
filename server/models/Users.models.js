import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            require: [true, 'Please add a full name']
        },
        email: {
            type: String,
            require: [true, 'Please add an email'],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            require: [true, 'Please add a password'],
            minlenght: [6, 'Password must be at least 6 characters'],

        },
        image: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        likedMovies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Movie'
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema);
