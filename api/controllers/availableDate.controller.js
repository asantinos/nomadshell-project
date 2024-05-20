const AvailableDate = require("../models/availableDate.model");
const { errorHandler } = require("../utils/error");

// Get all available dates
const getAvailableDates = async (req, res) => {
    try {
        const availableDates = await AvailableDate.find();
        res.json(availableDates);
    } catch (error) {
        errorHandler(res, error);
    }
};

// Create a new available date and delete old one if it exists
const createAvailableDate = async (req, res) => {
    try {
        if (!req.body.startDate || !req.body.endDate) {
            return;
        }

        const availableDate = await AvailableDate.findOne({
            home: req.body.home,
        });

        if (availableDate) {
            await AvailableDate.findByIdAndDelete(availableDate._id);
        }

        const newAvailableDate = new AvailableDate(req.body);
        await newAvailableDate.save();
        res.json(newAvailableDate);
    } catch (error) {
        errorHandler(res, error);
    }
};

// Delete an available date
const deleteAvailableDate = async (req, res) => {
    try {
        await AvailableDate.findByIdAndDelete(req.params.id);
        res.json({ message: "Available date deleted successfully" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    getAvailableDates,
    createAvailableDate,
    deleteAvailableDate,
};
