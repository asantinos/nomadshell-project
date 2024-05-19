const express = require("express");
const {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
} = require("../controllers/booking.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/all", verifyToken, getBookings);
router.get("/:id", verifyToken, getBooking);
router.post("/create", verifyToken, createBooking);
router.put("/update/:id", verifyToken, updateBooking);
router.delete("/delete/:id", verifyToken, deleteBooking);

module.exports = router;
