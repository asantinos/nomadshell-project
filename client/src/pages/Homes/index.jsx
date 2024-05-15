import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import HomeCard from "@components/Homes/HomeCard";
import Search from "@icons/search";
import Check from "@icons/check";
import Cross from "@icons/cross";
import Loader from "@components/Loader";
import Footer from "@components/Footer";

function Homes() {
    const { currentUser } = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [homes, setHomes] = useState([]);

    useEffect(() => {
        const fetchHomes = async () => {
            try {
                const response = await axios.get("/api/homes/all");
                setHomes(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchHomes();
    }, []);

    return isLoading ? (
        <Loader />
    ) : (
        <main className="h-content pt-header">
            <div className="max-w-7xl mx-auto p-6 py-0 sm:py-3">
                <section className="mt-6">
                    {homes.length === 0 ? (
                        <div className="h-content">
                            <p className="text-2xl font-semibold">
                                No homes available at the moment
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="max-w-7xl mx-auto">
                                <form className="flex flex-col md:flex-row w-full gap-2 items-center justify-between">
                                    <div
                                        id="map-search-input-container"
                                        className="relative w-full md:w-fit flex items-center border rounded-2xl overflow-hidden"
                                    >
                                        <label htmlFor="map-search-input">
                                            <Search
                                                color="#314939"
                                                size={24}
                                                className="ml-3"
                                            />
                                        </label>
                                        <label
                                            htmlFor="map-search-input"
                                            className="sr-only"
                                        >
                                            Search by country
                                        </label>
                                        <input
                                            type="text"
                                            id="map-search-input"
                                            placeholder="Search by country..."
                                            className="bg-white px-4 py-3 w-full md:w-64 ring-0 outline-none rounded-none"
                                        />
                                        <button
                                            className="absolute right-12 bg-white p-3"
                                            type="button"
                                        >
                                            <Cross color="#314939" size={12} />
                                        </button>
                                        <button
                                            id="map-search-button"
                                            className="bg-gray-lighter hover:bg-gray-semilight p-3 rounded-r-2xl"
                                            type="button"
                                        >
                                            <Check color="#314939" size={24} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <h3 className="text-3xl font-bold py-4">
                                <span id="homes-total-results">
                                    {homes.length}
                                </span>{" "}
                                Results
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 mt-4">
                                {homes.map((home) => (
                                    <HomeCard key={home._id} home={home} />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}

export default Homes;
