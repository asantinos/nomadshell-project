const express = require("express");
const {
    getAvailableDates,
    addAvailableDate,
    deleteAvailableDate,
} = require("../controllers/availableDate.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/:homeId", getAvailableDates);
router.post("/:homeId", verifyToken, addAvailableDate);
router.delete("/:id", verifyToken, deleteAvailableDate);

module.exports = router;