import React from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckoutButton = ({ priceId, title }) => {
    const { currentUser } = useSelector((state) => state.user);
    console.log(currentUser);

    const stripe = useStripe();

    const handleCheckout = async () => {
        const response = await axios.post(
            "/api/subscriptions/create-checkout-session",
            { priceId }
        );

        const session = response.data;

        console.log(session.sessionId);

        const result = await stripe.redirectToCheckout({
            sessionId: session.sessionId,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className={`w-full bg-gray-dark hover:bg-black text-white font-medium rounded-full py-3 mt-8 transition duration-200 ease-in-out ${
                currentUser.user.planType === title.toLowerCase()
                    ? "pointer-events-none opacity-10"
                    : "cursor-pointer"
            }`}
        >
            {currentUser.user.planType === "free"
                ? "Select Plan"
                : currentUser.user.planType === title.toLowerCase()
                ? "Current Plan"
                : "Upgrade Plan"}
        </button>
    );
};

export default CheckoutButton;
