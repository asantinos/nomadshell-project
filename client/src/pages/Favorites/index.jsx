import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import Loader from "@components/Loader";
import Footer from "@components/Footer";

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
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <main className="h-auto pt-header">
                        <section>
                            <div className="p-6 max-w-7xl mx-auto">
                                <h2 className="text-3xl font-bold">
                                    Favorites
                                </h2>

                                <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {favorites.map((home) => (
                                        <Link
                                            key={home._id}
                                            to={`/homes/${home._id}`}
                                            className="block overflow-hidden bg-white rounded-lg shadow-lg"
                                        >
                                            <img
                                                src={home.images[0]}
                                                alt={home.title}
                                                className="object-cover w-full h-48"
                                            />

                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold">
                                                    {home.title}
                                                </h3>
                                                <p className="mt-2 text-sm">
                                                    ${home.price}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}

                                    {favorites.length === 0 && (
                                        <div className="text-center">
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
        </>
    );
};

export default Favorites;
