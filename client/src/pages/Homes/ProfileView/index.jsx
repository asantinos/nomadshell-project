import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import Loader from "@components/Loader";
import Footer from "@components/Footer";

const ProfileView = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [userHomes, setUserHomes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/get/${id}`);

                setUser(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchUserHomes = async () => {
            try {
                const { data } = await axios.get(`/api/users/${id}/homes`);

                setUserHomes(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
        fetchUserHomes();
    }, [id]);

    useEffect(() => {
        const fetchLocation = async (home) => {
            const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
            const { lat, lng } = {
                lat: home.location[1],
                lng: home.location[0],
            };
            try {
                if (home.location.length > 0) {
                    const response = await axios.get(
                        `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${apiKey}&radius=100`
                    );
                    const address = response.data.addresses[0].address;
                    home.location = {
                        city: address.municipality,
                        country: address.country,
                    };

                    setUserHomes([...userHomes]);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (userHomes.length > 0) {
            userHomes.forEach((home) => {
                fetchLocation(home);
            });
        }
    }, [userHomes]);

    if (!user) {
        return null;
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <main className="h-auto pt-header">
                        <section>
                            <div className="p-6 max-w-7xl mx-auto">
                                <div className="flex items-center justify-between gap-8">
                                    <div className="flex items-center gap-4 sm:gap-8">
                                        <div className="mt-4 flex flex-col items-center justify-center text-center">
                                            <img
                                                src={user.avatar}
                                                alt={`${user.name} ${user.surname} avatar`}
                                                className="w-24 h-24 rounded-3xl object-cover"
                                            />
                                            <span
                                                className={`-mt-3 font-bold text-xs px-3 py-1 rounded-full text-white
                                    ${
                                        user.planType === "free"
                                            ? "bg-green-500"
                                            : user.planType === "explorer"
                                            ? "bg-blue-500"
                                            : user.planType === "adventurer"
                                            ? "bg-yellow-500"
                                            : user.planType === "nomad" &&
                                              "bg-purple-500"
                                    }
                                `}
                                            >
                                                {user.planType
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    user.planType.slice(1)}
                                            </span>
                                        </div>

                                        <div>
                                            <h1 className="text-2xl font-bold">
                                                {user.name} {user.surname}
                                            </h1>
                                            <p className="text-gray-500 mt-1">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 sm:mb-14">
                                    <div className="flex flex-col justify-center gap-2 mb-4">
                                        <h2 className="text-2xl font-bold">
                                            {user.name}'s Homes
                                        </h2>
                                    </div>

                                    <div>
                                        {userHomes.length === 0 ? (
                                            <p className="text-gray-500 mb-8">
                                                User doesn't have any homes yet.
                                            </p>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8">
                                                    {userHomes.map((home) => (
                                                        <div
                                                            key={home._id}
                                                            className="bg-gray-lighter rounded-3xl p-6"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <Link
                                                                    to={`/homes/${home._id}`}
                                                                    className="text-black font-bold"
                                                                >
                                                                    {home.title}
                                                                </Link>
                                                            </div>
                                                            <p className="text-gray-500 mt-4">
                                                                {
                                                                    home.description
                                                                }
                                                            </p>
                                                            <p className="text-gray-500 mt-4">
                                                                {home.type}
                                                            </p>
                                                            <p className="text-gray-500 mt-4">
                                                                {home.price} /
                                                                night
                                                            </p>
                                                            <p className="text-gray-500 mt-4">
                                                                {home.sqrt} sqrt
                                                            </p>
                                                            <p className="text-gray-500 mt-4">
                                                                {home.bedrooms}{" "}
                                                                bedrooms
                                                            </p>
                                                            <p className="text-gray-500 mt-4">
                                                                {home.bathrooms}{" "}
                                                                bathrooms
                                                            </p>
                                                            <p className="text-gray-500 mt-4">
                                                                {home.parking
                                                                    ? "Parking 🚗"
                                                                    : "No parking"}
                                                            </p>
                                                            <p className="text-gray-500 mt-4">
                                                                Location:{" "}
                                                                {
                                                                    home
                                                                        .location
                                                                        .city
                                                                }
                                                                ,{" "}
                                                                {
                                                                    home
                                                                        .location
                                                                        .country
                                                                }
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
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

export default ProfileView;
