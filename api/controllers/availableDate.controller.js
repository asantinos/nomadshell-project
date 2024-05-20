const AvailableDate = require("../models/availableDate.model");
const { errorHandler } = require("../utils/error");

// Get available date for a home
const getAvailableDate = async (req, res) => {
    try {
        const availableDate = await AvailableDate.find({
            home: req.params.homeId,
        });
        res.json(availableDate);
    } catch (error) {
        errorHandler(res, error);
    }
};

// Add new available date for a home, delete old one
const addAvailableDate = async (req, res) => {
    const { homeId } = req.params;
    const { start, end } = req.body;

    if (!start || !end) {
        return res
            .status(400)
            .json({ message: "Checkin and checkout dates are required" });
    }

    try {
        const availableDate = await AvailableDate.create({
            home: homeId,
            start,
            end,
        });
        res.json(availableDate);
    } catch (error) {
        errorHandler(res, error);
    }
};

// Delete available date for a home
const deleteAvailableDate = async (req, res) => {
    try {
        const availableDate = await AvailableDate.findByIdAndDelete(
            req.params.id
        );
        if (!availableDate) {
            return res.status(404).json({ error: "Available date not found" });
        }
        res.json({ message: "Available date deleted" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    getAvailableDate,
    addAvailableDate,
    deleteAvailableDate,
};
