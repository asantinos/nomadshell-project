const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        surname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        nomadPoints: {
            type: Number,
            default: 0,
        },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Home",
            },
        ],
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        planType: {
            type: String,
            enum: ["free", "explorer", "adventurer", "nomad"],
            default: "free",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;