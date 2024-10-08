const express = require("express");
const router = express.Router();
const {
    createCheckoutSession,
} = require("../controllers/subscription.controller");

router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
