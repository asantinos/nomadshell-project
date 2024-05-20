const AvailableDate = require("../models/availableDate.model");
const { errorHandler } = require("../utils/error");

// Get available dates for a home
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

// Add new available dates for a home (minimum 2 days), delete old ones
const addAvailableDates = async (req, res) => {
    try {
        const { dates } = req.body;

        if (dates.length < 2) {
            return res.status(400).json({ message: "Minimum 2 days required" });
        }

        const availableDates = await AvailableDate.find({
            home: req.params.homeId,
        });

        if (availableDates.length > 0) {
            await AvailableDate.deleteMany({ home: req.params.homeId });
        }

        const newDates = dates.map((date) => ({
            home: req.params.homeId,
            date,
        }));

        const newAvailableDates = await AvailableDate.insertMany(newDates);

        res.json(newAvailableDates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete all available dates for a home
const deleteAvailableDates = async (req, res) => {
    try {
        await AvailableDate.deleteMany({ home: req.params.homeId });

        res.json({ message: "Deleted all available dates" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAvailableDates,
    addAvailableDates,
    deleteAvailableDates,
};
