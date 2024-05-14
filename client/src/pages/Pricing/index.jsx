import React from "react";
import Footer from "@components/Footer";
import PricingCard from "@components/Pricing/PricingCard";
import CheckBoxFill from "@icons/check-box-fill";

function Pricing() {
    return (
        <>
            <main className="h-content">
                <section className="max-w-7xl mx-auto text-center p-6">
                    <div>
                        <h3 className="text-4xl font-bold">Pricing</h3>
                        <p className="text-base sm:text-lg mt-4 tracking-tight">
                            Select a subscbrption plan that suits your needs
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 sm:mt-16">
                        <PricingCard
                            title="Explorer"
                            description="For those who want to travel occasionally"
                            listItems={[
                                "3000 NomadPoints",
                                "Travel insurance coverage",
                                "Discounts on travel accessories",
                            ]}
                            price="$199.99"
                        />

                        <PricingCard
                            isMostPopular
                            title="Adventurer"
                            description="For those who want to travel more"
                            listItems={[
                                "6500 NomadPoints",
                                "Discounts on flights and accommodations",
                                "Personalized travel recommendations",
                            ]}
                            price="$249.99"
                        />

                        <PricingCard
                            title="Nomad"
                            titleAtt="uppercase font-extrabold bg-text-gradient text-transparent bg-clip-text"
                            description="For those who want to be a nomad"
                            listItems={[
                                "10,000 NomadPoints",
                                "Exclusive access to luxury accommodations",
                                "Personal travel concierge",
                                "Priority booking for popular destinations",
                                "Free language learning courses",
                            ]}
                            price="$319.99"
                        />
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
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                            className="min-w-fit"
                                        />
                                        Unlimited home exchanges
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        Unlimited vacation stays
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        Unlimited destinations
                                    </li>
                                </ul>
                                <ul className="flex flex-col gap-8 sm:gap-12">
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        Advanced search options
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        Customizable profiles
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        24/7 customer support
                                    </li>
                                </ul>
                                <ul className="flex flex-col gap-8 sm:gap-12">
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        Verified listings
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        Secure payments
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <CheckBoxFill
                                            color={"#000"}
                                            size={32}
                                        />
                                        Access to exclusive deals
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}

export default Pricing;
