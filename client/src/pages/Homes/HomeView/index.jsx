import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DateRangePicker } from "@nextui-org/react";

import Loader from "@components/Loader";
import Footer from "@components/Footer";

const HomeView = () => {
    const { id } = useParams();
    const [home, setHome] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeDetails = async () => {
            try {
                const response = await fetch(`/api/homes/${id}`);
                const data = await response.json();
                setHome(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching home details:", error);
            }
        };

        fetchHomeDetails();
    }, [id]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="p-6 max-w-7xl mx-auto pt-header">
                        <img
                            src={home.images[0]}
                            alt={home.title}
                            className="w-full h-64 object-cover object-center"
                        />
                        <div className="mt-8">
                            <h1 className="text-3xl font-semibold">
                                {home.title}
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                {home.description}
                            </p>
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold">
                                    Details
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">
                                        Location:
                                    </span>{" "}
                                    {home.location}
                                </p>
                                <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">
                                        Price:
                                    </span>{" "}
                                    {home.price} NP / night
                                </p>
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold">
                                        Features
                                    </h2>
                                    <ul className="mt-2 text-gray-600">
                                        {home.parking && (
                                            <li>
                                                <span className="font-semibold">
                                                    Parking
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold">Book now</h2>
                            <DateRangePicker
                                variant="bordered"
                                isRequired
                                label="Select a date"
                                visibleMonths={2}
                                onChange={(date) => console.log(date)}
                            />
                            <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
                                Book now
                            </button>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
};

export default HomeView;
