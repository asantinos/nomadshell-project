import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} from "@redux/user/userSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "@components/Footer";

import HomeIcon from "@icons/home";
import SettingsVertical from "@icons/settings-vertical";

function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const [userBookings, setUserBookings] = useState([
        // example booking
        {
            _id: "1",
            checkInDate: "2021-12-01",
            checkOutDate: "2021-12-05",
            home: {
                title: "Home Title",
            },
        },
        {
            _id: "2",
            checkInDate: "2021-12-01",
            checkOutDate: "2021-12-05",
            home: {
                title: "Home Title",
            },
        },
        {
            _id: "3",
            checkInDate: "2021-12-01",
            checkOutDate: "2021-12-05",
            home: {
                title: "Home Title",
            },
        },
    ]);

    // useEffect(() => {
    //     const fetchUserBookings = async () => {
    //         try {
    //             // TODO : Make Booking model, controller and route
    //             const response = await axios.get(
    //                 `http://localhost:3000/api/bookings/user/${currentUser.user._id}`
    //             );
    //             setUserBookings(response.data);
    //         } catch (error) {
    //             console.error(error.message);
    //         }
    //     };

    //     fetchUserBookings();
    // }, [currentUser.user._id]);

    return (
        <>
            <main className="h-auto">
                <section>
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-8">
                                <div className="mt-4 flex flex-col items-center justify-center text-center">
                                    <img
                                        src={currentUser.user.avatar}
                                        alt={`${currentUser.user.name} ${currentUser.user.surname} avatar`}
                                        className="w-24 h-24 rounded-3xl"
                                    />
                                    <span
                                        className={`-mt-3 font-bold text-xs px-3 py-1 rounded-full text-white
                                    ${
                                        currentUser.user.planType === "free"
                                            ? "bg-green-500"
                                            : currentUser.user.planType ===
                                              "explorer"
                                            ? "bg-blue-500"
                                            : currentUser.user.planType ===
                                              "adventurer"
                                            ? "bg-yellow-500"
                                            : currentUser.user.planType ===
                                                  "nomad" && "bg-purple-500"
                                    }
                                `}
                                    >
                                        {currentUser.user.planType
                                            .charAt(0)
                                            .toUpperCase() +
                                            currentUser.user.planType.slice(1)}
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {currentUser.user.name}{" "}
                                        {currentUser.user.surname}
                                    </h1>
                                    <p className="text-gray-500 mt-1">
                                        {currentUser.user.email}
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/profile/settings"
                                className="border border-black hover:bg-neutral-200 p-4 rounded-3xl transition duration-200 ease-in-out"
                            >
                                <SettingsVertical size="24" color="#000" />
                            </Link>
                        </div>

                        <div className="mt-10 mb-20">
                            <h2 className="text-2xl font-bold mb-8">
                                My Homes
                            </h2>
                            {currentUser.user.planType === "free" ? (
                                <div>
                                    <p className="text-gray-500 mb-8">
                                        You need to upgrade your plan to add
                                        homes.
                                    </p>
                                    <Link
                                        to="/pricing"
                                        className="border border-black hover:bg-black hover:text-white font-bold py-4 px-8 rounded-3xl transition duration-200 ease-in-out"
                                    >
                                        Upgrade Plan
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <Link
                                        to="/add-home"
                                        className="border border-black hover:bg-black hover:text-white font-bold py-4 px-8 rounded-3xl transition duration-200 ease-in-out"
                                    >
                                        Add Home
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">
                                My Bookings
                            </h2>
                            {userBookings.length === 0 ? (
                                <p className="text-gray-500">
                                    You don't have any bookings yet.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {userBookings.map((booking) => (
                                        <div
                                            key={booking._id}
                                            className="bg-neutral-200 rounded-2xl p-6"
                                        >
                                            <div className="flex items-center justify-between">
                                                <HomeIcon
                                                    size="24"
                                                    color="#000"
                                                />
                                                <p className="text-gray-500">
                                                    {booking.home.title}
                                                </p>
                                            </div>
                                            <p className="text-gray-500 mt-4">
                                                {new Date(
                                                    booking.checkInDate
                                                ).toLocaleDateString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    booking.checkOutDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Profile;