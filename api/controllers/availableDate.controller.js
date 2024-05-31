/**
 * Controller handling operations related to available dates.
 * @module controllers/availableDate.controller
 */

const AvailableDate = require("../models/availableDate.model");
const { errorHandler } = require("../utils/error");

/**
 * Retrieves all available dates.
 * @function getAvailableDates
 * @memberof module:controllers/availableDate.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getAvailableDates = async (req, res) => {
    try {
        const availableDates = await AvailableDate.find();
        res.json(availableDates);
    } catch (error) {
        errorHandler(res, error);
    }
};

/**
 * Creates a new available date and deletes the old one if it exists.
 * @function createAvailableDate
 * @memberof module:controllers/availableDate.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
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

/**
 * Deletes an available date.
 * @function deleteAvailableDate
 * @memberof module:controllers/availableDate.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
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
