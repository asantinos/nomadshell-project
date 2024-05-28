import React from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { subscribeUser } from "@redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutButton = ({ priceId, title }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const stripe = useStripe();

    const handleCheckout = async () => {
        try {
            const response = await axios.post(
                "/api/subscriptions/create-checkout-session",
                {
                    priceId,
                    userId: currentUser.user._id,
                    planType: title.toLowerCase(),
                }
            );

            const session = response.data;

            const result = await stripe.redirectToCheckout({
                sessionId: session.sessionId,
            });

            if (result.error) {
                console.error(result.error.message);
            } else {
                dispatch(subscribeUser(title.toLowerCase()));
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <button
            onClick={currentUser ? handleCheckout : () => navigate("/sign-in")}
            className={`w-full bg-gray-dark hover:bg-black text-white font-medium rounded-full py-3 mt-8 transition duration-200 ease-in-out ${
                currentUser && currentUser.user.planType === title.toLowerCase()
                    ? "pointer-events-none opacity-10"
                    : "cursor-pointer"
            }`}
        >
            {(currentUser && currentUser.user.planType === "free") ||
            !currentUser
                ? "Select Plan"
                : currentUser &&
                  currentUser.user.planType === title.toLowerCase()
                ? "Current Plan"
                : "Change Plan"}
        </button>
    );
};

export default CheckoutButton;
