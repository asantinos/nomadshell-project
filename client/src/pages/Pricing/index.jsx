import React, { useState } from "react";
import Footer from "@components/Footer";
import PricingCard from "@components/Pricing/PricingCard";
import CheckBoxFill from "@icons/check-box-fill";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);

    const handlePlanSelect = (plan, price) => {
        setSelectedPlan(plan);
        setSelectedPrice(price);
    };

    return (
        <>
            <main className="h-auto pt-header">
                <section className="max-w-7xl mx-auto text-center p-6">
                    <div>
                        <h3 className="text-4xl font-bold">Pricing</h3>
                        <p className="text-base sm:text-lg mt-4 tracking-tight">
                            Select a subscription plan that suits your needs
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 sm:mt-16">
                        {[
                            {
                                title: "Explorer",
                                price: 199.99,
                                description:
                                    "For those who want to travel occasionally",
                                listItems: [
                                    "3,000 NomadPoints",
                                    "Travel insurance coverage",
                                    "Discounts on travel accessories",
                                ],
                                isMostPopular: false,
                            },
                            {
                                title: "Adventurer",
                                price: 249.99,
                                description:
                                    "For those who want to travel more",
                                listItems: [
                                    "6,500 NomadPoints",
                                    "Discounts on flights and accommodations",
                                    "Personalized travel recommendations",
                                ],
                                isMostPopular: true,
                            },
                            {
                                title: "Nomad",
                                price: 319.99,
                                description: "For those who want to be a nomad",
                                listItems: [
                                    "10,000 NomadPoints",
                                    "Exclusive access to luxury accommodations",
                                    "Personal travel concierge",
                                    "Priority booking for popular destinations",
                                    "Free language learning courses",
                                ],
                                isMostPopular: false,
                            },
                        ].map((plan) => (
                            <Elements key={plan.title} stripe={stripePromise}>
                                <PricingCard
                                    title={plan.title}
                                    titleAtt={
                                        plan.title === "Nomad"
                                            ? "uppercase font-extrabold bg-text-gradient text-transparent bg-clip-text"
                                            : ""
                                    }
                                    description={plan.description}
                                    listItems={plan.listItems}
                                    price={plan.price}
                                    isMostPopular={plan.isMostPopular}
                                    onSelectPlan={handlePlanSelect}
                                />
                            </Elements>
                        ))}
                    </div>

                    <div className="mt-16">
                        <p className="text-base text-gray-light">
                            Not sure which plan is right for you?{" "}
                            <a href="#" className="text-black hover:underline">
                                Contact us
                            </a>{" "}
                            and we'll help you choose.
                        </p>
                    </div>

                    <div className="mt-16">
                        <p className="text-sm">
                            All plans come with a 30-day money-back guarantee
                            and include:
                        </p>
                        <div className="mt-10 flex justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 space-y-8 sm:space-y-0 sm:gap-12 lg:gap-32 w-fit font-medium whitespace-nowrap">
                                <ul className="flex flex-col gap-8 sm:gap-12">
                                    {[
                                        "Unlimited home exchanges",
                                        "Unlimited vacation stays",
                                        "Unlimited destinations",
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-4"
                                        >
                                            <CheckBoxFill
                                                color={"#000"}
                                                size={32}
                                                className="min-w-fit"
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <ul className="flex flex-col gap-8 sm:gap-12">
                                    {[
                                        "Advanced search options",
                                        "Customizable profiles",
                                        "24/7 customer support",
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-4"
                                        >
                                            <CheckBoxFill
                                                color={"#000"}
                                                size={32}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <ul className="flex flex-col gap-8 sm:gap-12">
                                    {[
                                        "Verified listings",
                                        "Secure payments",
                                        "Access to exclusive deals",
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-4"
                                        >
                                            <CheckBoxFill
                                                color={"#000"}
                                                size={32}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Pricing;
