const Home = require("../models/home.model");
const User = require("../models/user.model");
const AvailableDate = require("../models/availableDate.model");
const Booking = require("../models/booking.model");
const { errorHandler } = require("../utils/error");

// Get all homes (with filters if needed)
const getHomes = async (req, res, next) => {
    try {
        // Pagination
        const limit = parseInt(req.query.limit) || 6;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

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

        // const sort = req.query.sort || "createdAt";
        // const order = req.query.order || "desc";

        const homes = await Home.find({
            title: { $regex: searchTerm, $options: "i" }, // i for case-insensitive
            parking,
            type,
            ...priceQuery,
        })
            .populate("owner", "name surname avatar planType") // Populate the owner data
            // .sort({ [sort]: order })
            .limit(limit)
            .skip(skip);

        return res.status(200).json(homes);
    } catch (error) {
        next(error);
    }
};

// Get a home by ID
const getHome = async (req, res, next) => {
    try {
        const home = await Home.findById(req.params.id).populate(
            "owner",
            "name surname avatar planType"
        );
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

    if (req.user.id !== home.owner.toString() && req.user.role !== "admin") {
        return next(errorHandler(403, "Forbidden"));
    }

    try {
        // Delete the home from users' favorites
        const users = await User.find({ favorites: req.params.id });
        users.forEach(async (user) => {
            user.favorites = user.favorites.filter(
                (favorite) => favorite.toString() !== req.params.id
            );
            await user.save();
        });
        // Delete the home's available dates
        await AvailableDate.deleteMany({ home: req.params.id });
        await Home.findByIdAndDelete(req.params.id);
        return res.status(204).json({ message: "Home deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Get home's available dates
const getAvailableDates = async (req, res, next) => {
    try {
        const availableDates = await AvailableDate.find({
            home: req.params.id,
        });

        if (!availableDates) {
            return next(errorHandler(404, "Available dates not found"));
        }

        return res.status(200).json(availableDates);
    } catch (error) {
        next(error);
    }
};

// Get bookings for a home
const getHomeBookings = async (req, res, next) => {
    try {
        const home = await Home.findById(req.params.id);
        if (!home) {
            return next(errorHandler(404, "Home not found"));
        }

        const bookings = await Booking.find({ home: req.params.id });

        return res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHomes,
    getHome,
    createHome,
    updateHome,
    deleteHome,
    getAvailableDates,
    getHomeBookings,
};
