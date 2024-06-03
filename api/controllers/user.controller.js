/**
 * Controller handling operations related to users.
 * @module controllers/user.controller
 */

const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");
const Home = require("../models/home.model");
const Booking = require("../models/booking.model");


/**
 * Retrieves all users.
 * @function getUsers
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


/**
 * Retrieves a user by ID.
 * @function getUserById
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
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

/**
 * Retrieves the actual signed-in user.
 * @function getUser
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
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

/**
 * Updates a user by ID.
 * @function updateUser
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
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
                    nomadPoints: req.body.nomadPoints,
                    planType: req.body.planType,
                    role: req.body.role,
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

/**
 * Deletes a user by ID.
 * @function deleteUser
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
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

/**
 * Retrieves homes owned by a user.
 * @function getUserHomes
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const getUserHomes = async (req, res, next) => {
    try {
        const homes = await Home.find({ owner: req.params.id });
        res.status(200).json(homes);
    } catch (error) {
        next(errorHandler(500, "Internal Server Error"));
    }
};

/**
 * Retrieves bookings made by a user.
 * @function getUserBookings
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
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

/**
 * Adds or removes a home from user's favorites.
 * @function toggleFavorite
 * @memberof module:controllers/user.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
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
