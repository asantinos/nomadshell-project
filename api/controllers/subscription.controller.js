/**
 * Controller handling operations related to subscriptions.
 * @module controllers/subscription.controller
 */

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user.model");

/**
 * Creates a checkout session for subscription.
 * @function createCheckoutSession
 * @memberof module:controllers/subscription.controller
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const createCheckoutSession = async (req, res) => {
    const { priceId, userId, planType } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: "http://nomadshell.com/pricing/", // ! Change this to your website URL
            cancel_url: "http://nomadshell.com/pricing/", // ! Change this to your website URL
            metadata: {
                userId: userId,
                planType: planType,
            },
        });

        // TODO : Check if transaction is successful
        const user = await User.findById(userId);
        if (user) {
            user.planType = planType;

            if (planType === "explorer") {
                user.nomadPoints += 3000;
            } else if (planType === "adventurer") {
                user.nomadPoints += 6500;
            } else if (planType === "nomad") {
                user.nomadPoints += 10000;
            } else {
                user.nomadPoints += 0;
            }

            await user.save();
        }

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            error: "An error occurred while creating the checkout session",
        });
    }
};

module.exports = { createCheckoutSession };
