const express = require("express");
const {
    getAvailableDates,
    addAvailableDates,
    deleteAvailableDates,
} = require("../controllers/availableDate.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/:homeId", getAvailableDates);
router.post("/:homeId", verifyToken, addAvailableDates);
router.delete("/:homeId", verifyToken, deleteAvailableDates);

module.exports = router;