const Booking = require("../models/booking.model");
const { errorHandler } = require("../utils/error");

// Get all bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("home");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single booking by ID
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

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { user, home } = req.body;

        const existingBooking = await Booking.findOne({ user, home });

        if (existingBooking) {
            return res.status(400).json({
                message: "You have already booked this home",
            });
        }

        const booking = await Booking.create(req.body);

        res.status(201).json({
            booking,
            message: "Booking created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a booking
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

// Delete a booking
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

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
