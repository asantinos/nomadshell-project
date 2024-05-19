const Home = require("../models/home.model");
const { errorHandler } = require("../utils/error");

// Get all homes (with filters if needed)
const getHomes = async (req, res, next) => {
    try {
        // Pagination
        const limit = parseInt(req.query.limit) || 9;
        const page = parseInt(req.query.page) || 1;

        // Filters
        let parking = req.query.parking;
        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = { $in: ["Apartment", "Farmhouse", "Bungalow", "Cottage"] };
        }

        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice =
            parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

        const priceQuery = {
            price: { $gte: minPrice, $lte: maxPrice }, // gte for greater than or equal to, lte for less than or equal to
        };

        const searchTerm = req.query.searchTerm || "";

        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";

        const homes = await Home.find({
            title: { $regex: searchTerm, $options: "i" }, // i for case-insensitive
            parking,
            type,
            ...priceQuery,
        })
            .populate("owner", "name surname") // Populate the owner field with the name and surname of the user
            .sort({ [sort]: order })
            .limit(limit)
            .skip(limit * (page - 1));

        return res.status(200).json(homes);
    } catch (error) {
        next(error);
    }
};

// Get a home by ID
const getHome = async (req, res, next) => {
    try {
        const home = await Home.findById(req.params.id);
        if (!home) {
            return next(errorHandler(404, "Home not found"));
        }

        return res.status(200).json(home);
    } catch (error) {
        next(error);
    }
};

// Create a new home
const createHome = async (req, res, next) => {
    try {
        const home = await Home.create(req.body);
        return res
            .status(201)
            .json({ home, message: "Home created successfully" });
    } catch (error) {
        next(error);
    }
};

// Update a home
const updateHome = async (req, res, next) => {
    const home = await Home.findById(req.params.id);
    if (!home) {
        return next(errorHandler(404, "Home not found"));
    }

    if (req.user.id !== home.owner.toString()) {
        return next(errorHandler(403, "Forbidden"));
    }

    try {
        const updatedHome = await Home.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res
            .status(200)
            .json({ updatedHome, message: "Home updated successfully" });
    } catch (error) {
        next(error);
    }
};

// Delete a home
const deleteHome = async (req, res, next) => {
    const home = await Home.findById(req.params.id);
    if (!home) {
        return next(errorHandler(404, "Home not found"));
    }

    if (req.user.id !== home.owner && req.user.role !== "admin") {
        return next(errorHandler(403, "Forbidden"));
    }

    try {
        await Home.findByIdAndDelete(req.params.id);
        return res.status(204).json({ message: "Home deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getHomes, getHome, createHome, updateHome, deleteHome };
