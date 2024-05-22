const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    const { priceId } = req.body;

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
            success_url:
                "http://localhost:5173/pricing/", // ! Change this to your website URL
            cancel_url: "http://localhost:5173/pricing/", // ! Change this to your website URL
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            error: "An error occurred while creating the checkout session",
        });
    }
};

module.exports = { createCheckoutSession };
