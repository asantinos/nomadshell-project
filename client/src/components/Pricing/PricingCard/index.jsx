import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PricingCard({
    title,
    titleAtt,
    description,
    listItems,
    price,
    isMostPopular,
    priceId,
}) {
    const handleSelectPlan = async () => {
        const stripe = await stripePromise;

        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            successUrl: `${window.location.origin}/checkout/success`,
            cancelUrl: `${window.location.origin}/checkout/cancel`,
        });

        if (error) {
            console.error("[Error]", error);
        }
    };

    return (
        <div
            className={`${
                isMostPopular ? "relative border-black" : "border-transparent"
            } w-full flex flex-col justify-between bg-gray-lighter backdrop:opacity-50 rounded-3xl p-8 border-4`}
        >
            {isMostPopular && (
                <h2 className="absolute border-2 border-black bg-black text-white whitespace-nowrap px-6 py-1 rounded-full -top-5 left-[50%] -translate-x-[50%] font-bold">
                    Most Popular
                </h2>
            )}
            <div>
                <h3 className={`text-3xl font-bold ${titleAtt}`}>{title}</h3>
                <p className="text-base text-gray-light mt-6">{description}</p>
                <ul className="list-disc list-inside mt-8 text-left space-y-4">
                    {listItems.map((item, index) => (
                        <li key={index} className="list-inside -indent-6 pl-12">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-2xl font-medium mt-4">
                ${price}{" "}
                <span className="text-sm text-gray-light mt-4">/ year</span>
            </p>
            <button
                onClick={handleSelectPlan}
                className="w-full bg-gray-dark hover:bg-black text-white font-medium rounded-full py-3 mt-8 transition duration-200 ease-in-out"
            >
                Select Plan
            </button>
        </div>
    );
}

export default PricingCard;
