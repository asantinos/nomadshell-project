const express = require("express");
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserHomes,
} = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/me", verifyToken, getUser);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/:id/homes", verifyToken, getUserHomes);

module.exports = router;
