const express = require("express");
const {
    getHomes,
    getHome,
    createHome,
    updateHome,
    deleteHome,
    getAvailableDates,
} = require("../controllers/home.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/all", getHomes);
router.get("/:id", getHome);
router.post("/create", verifyToken, createHome);
router.put("/update/:id", verifyToken, updateHome);
router.delete("/delete/:id", verifyToken, deleteHome);
router.get("/:id/availableDates", getAvailableDates);

module.exports = router;
