/**
 * Controller handling operations related to bookings.
 * @module controllers/booking.controller
 */

const Booking = require("../models/booking.model");
const { errorHandler } = require("../utils/error");
const User = require("../models/user.model");

/**
 * Retrieves all bookings.
 * @function getBookings
 * @memberof module:controllers/booking.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("home").populate("user");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Retrieves a single booking by ID.
 * @function getBooking
 * @memberof module:controllers/booking.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("home");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Creates a new booking.
 * @function createBooking
 * @memberof module:controllers/booking.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const createBooking = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if user has enough nomadPoints
        if (user.nomadPoints < req.body.totalPrice) {
            return res.status(400).json({
                message: "Not enough nomadPoints",
            });
        }

        const booking = new Booking({
            ...req.body,
            user: req.user.id,
        });

        await booking.save();

        // Update user's nomadPoints
        user.nomadPoints -= booking.totalPrice;
        await user.save();

        res.status(201).json({
            booking,
            message: "Booking created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Updates a booking.
 * @function updateBooking
 * @memberof module:controllers/booking.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        res.json({
            booking,
            message: "Booking updated successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Deletes a booking.
 * @function deleteBooking
 * @memberof module:controllers/booking.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        // Update user's nomadPoints
        const user = await User.findById(booking.user);
        user.nomadPoints += booking.totalPrice;
        await user.save();

        res.json({
            message: "Booking deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
};
