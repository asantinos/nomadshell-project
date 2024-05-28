import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import Loader from "@components/Loader";
import Footer from "@components/Footer";
import HomeCard from "@components/Homes/HomeCard";

const Favorites = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`/api/users/me`);
                setFavorites(response.data.favorites);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        if (currentUser) {
            fetchFavorites();
        }
    }, [currentUser]);

    return (
        <div className="flex flex-col min-h-screen">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <main className="flex-grow pt-header">
                        <section>
                            <div className="p-6 max-w-7xl mx-auto">
                                <h2 className="text-3xl font-bold">
                                    Favorites
                                </h2>

                                <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {favorites.map((home) => (
                                        <HomeCard key={home._id} home={home} />
                                    ))}

                                    {favorites.length === 0 && (
                                        <div>
                                            <p className="text-lg">
                                                No favorites found.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </main>

                    <Footer />
                </>
            )}
        </div>
    );
};

export default Favorites;
