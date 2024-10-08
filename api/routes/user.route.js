const express = require("express");
const {
    getUsers,
    getUserById,
    getUser,
    updateUser,
    deleteUser,
    getUserHomes,
    getUserBookings,
    toggleFavorite,
} = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/all", verifyToken, getUsers);
router.get("/me", verifyToken, getUser);
router.get("/get/:id", getUserById);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/:id/homes", getUserHomes);
router.get("/:id/bookings", verifyToken, getUserBookings);
router.post("/toggleFavorite/:id", verifyToken, toggleFavorite);

module.exports = router;
