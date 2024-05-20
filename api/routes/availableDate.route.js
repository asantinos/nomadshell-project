const express = require("express");
const {
    getAvailableDate,
    addAvailableDate,
    deleteAvailableDate,
} = require("../controllers/availableDate.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/:homeId", getAvailableDate);
router.post("/:homeId", verifyToken, addAvailableDate);
router.delete("/:homeId", verifyToken, deleteAvailableDate);

module.exports = router;
