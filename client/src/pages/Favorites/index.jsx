import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import Loader from "@components/Loader";
import Footer from "@components/Footer";

const Favorites = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [favorites, setFavorites] = useState([
        {
            id: 1,
            title: "Home Title",
            price: 100,
            image: "https://via.placeholder.com/300",
        },
        {
            id: 2,
            title: "Home Title",
            price: 200,
            image: "https://via.placeholder.com/300",
        },
        {
            id: 3,
            title: "Home Title",
            price: 300,
            image: "https://via.placeholder.com/300",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false); // Change to true

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <main className="h-auto pt-header">
                        <section>
                            <div className="p-6 max-w-7xl mx-auto">
                                <h2 className="text-2xl font-bold">
                                    Favorites
                                </h2>

                                <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {favorites.map((home) => (
                                        <Link
                                            key={home.id}
                                            to={`/homes/${home.id}`}
                                            className="block overflow-hidden bg-white rounded-lg shadow-lg"
                                        >
                                            <img
                                                src={home.image}
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

                                    <Link
                                        to="/homes"
                                        className="block overflow-hidden bg-white rounded-lg shadow-lg"
                                    >
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold">
                                                View More Homes
                                            </h3>
                                        </div>
                                    </Link>
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
