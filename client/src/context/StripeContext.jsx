import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeContext = ({ children }) => {
    return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeContext;
