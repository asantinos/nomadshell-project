const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");
const Home = require("../models/home.model");
const Booking = require("../models/booking.model");

// Get all users
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Get user by ID
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Get actual signed in user
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate({
                path: "favorites",
                populate: {
                    path: "owner",
                    model: "User",
                }
            });

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Update user by ID
const updateUser = async (req, res, next) => {
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                // $set is a MongoDB operator that updates the fields that are passed in the object
                $set: {
                    avatar: req.body.avatar,
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: req.body.password,
                },
            },
            { new: true }
        ).select("-password");

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json({ user, message: "User updated successfully" });
    } catch (error) {
        next(error);
    }
};

// Delete user by ID
const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
        return next(errorHandler(403, "Forbidden"));
    }

    try {
        await Home.deleteMany({ owner: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        if (req.user.id === req.params.id) {
            res.clearCookie("access_token");
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Get user's homes
const getUserHomes = async (req, res, next) => {
    try {
        const homes = await Home.find({ owner: req.params.id });
        res.status(200).json(homes);
    } catch (error) {
        next(errorHandler(500, "Internal Server Error"));
    }
};

// Get user's bookings
const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.params.id }).populate(
            "home"
        );
        res.status(200).json(bookings);
    } catch (error) {
        next(errorHandler(500, "Internal Server Error"));
    }
};

// Add or remove home from user's favorites
const toggleFavorite = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const index = user.favorites.indexOf(req.params.id);

        if (index === -1) {
            user.favorites.push(req.params.id);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.status(200).json(user.favorites);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    getUser,
    updateUser,
    deleteUser,
    getUserHomes,
    getUserBookings,
    toggleFavorite,
};
