const express = require("express");
const {
    getAvailableDates,
    createAvailableDate,
    deleteAvailableDate,
} = require("../controllers/availableDate.controller");

const router = express.Router();

router.get("/all", getAvailableDates);
router.post("/create", createAvailableDate);
router.delete("/delete/:id", deleteAvailableDate);

module.exports = router;
