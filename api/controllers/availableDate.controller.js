const AvailableDate = require("../models/availableDate.model");
const { errorHandler } = require("../utils/error");

// Get all available dates from a home
const getAvailableDates = async (req, res) => {
    try {
        const availableDates = await AvailableDate.find({
            home: req.params.homeId,
        });

        res.json(availableDates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new available date for a home
const addAvailableDate = async (req, res) => {
    try {
        const availableDate = await AvailableDate.create({
            home: req.params.homeId,
            date: req.body.date,
        });

        res.status(201).json({
            availableDate,
            message: "Available date created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an available date
const deleteAvailableDate = async (req, res) => {
    try {
        const availableDate = await AvailableDate.findByIdAndDelete(
            req.params.id
        );

        if (!availableDate) {
            return res.status(404).json({
                message: "Available date not found",
            });
        }

        res.json({ message: "Available date deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAvailableDates,
    addAvailableDate,
    deleteAvailableDate,
};
