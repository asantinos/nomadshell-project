import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Chip } from "@nextui-org/react";
import axios from "axios";
import Footer from "@components/Footer";

import ProfileHomeCard from "@components/Profile/HomeCard";
import Loader from "@components/Loader";

import HomeIcon from "@icons/home";
import SettingsVertical from "@icons/settings-vertical";
import Plus from "@icons/plus";
import Check from "@icons/check";
import Clock from "@icons/clock";
import Play from "@icons/play";

function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [userHomes, setUserHomes] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleConfirmDelete = () => {
        setConfirmDelete(!confirmDelete);
    };

    useEffect(() => {
        const fetchUserHomes = async () => {
            try {
                const response = await axios.get(
                    `/api/users/${currentUser.user._id}/homes`
                );

                setUserHomes(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserHomes();
    }, [currentUser.user.id]);

    const deleteHome = async (homeId) => {
        try {
            await axios.delete(`/api/homes/delete/${homeId}`);

            setUserHomes((prevHomes) =>
                prevHomes.filter((home) => home._id !== homeId)
            );
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const response = await axios.get(
                    `/api/users/${currentUser.user._id}/bookings`
                );

                setUserBookings(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserBookings();
    }, [currentUser.user.id]);

    const handleCancelBooking = (bookingId) => async () => {
        try {
            await axios.delete(`/api/bookings/delete/${bookingId}`);

            setUserBookings((prevBookings) =>
                prevBookings.filter((booking) => booking._id !== bookingId)
            );
        } catch (error) {
            console.error(error);
        }
    };

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
                                                src={currentUser.user.avatar}
                                                alt={`${currentUser.user.name} ${currentUser.user.surname} avatar`}
                                                className="w-24 h-24 rounded-3xl object-cover"
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
                                                    currentUser.user.planType.slice(
                                                        1
                                                    )}
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
                                        <SettingsVertical
                                            size="24"
                                            color="#000"
                                        />
                                    </Link>
                                </div>

                                <div className="mt-10 sm:mb-14">
                                    <div className="flex flex-col justify-center gap-2 mb-4">
                                        <h2 className="text-2xl font-bold">
                                            My Homes
                                        </h2>
                                        {currentUser.user.planType !==
                                            "free" && (
                                            <div className="w-fit mt-2">
                                                <Link
                                                    to="/profile/homes/add"
                                                    className="flex items-center justify-center gap-2 text-center border border-black rounded-2xl p-2 hover:bg-gray-lighter"
                                                >
                                                    <Plus
                                                        size={14}
                                                        color="black"
                                                    />
                                                    <span>Add Home</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    {currentUser.user.planType === "free" ? (
                                        <div>
                                            <p className="text-gray-500 mb-8">
                                                You need to upgrade your plan to
                                                add homes.
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
                                            {userHomes.length === 0 ? (
                                                <p className="text-gray-500 mb-8">
                                                    You don't have any homes
                                                    yet.
                                                </p>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8">
                                                        {userHomes.map(
                                                            (home) => (
                                                                <ProfileHomeCard
                                                                    key={
                                                                        home._id
                                                                    }
                                                                    home={home}
                                                                    deleteHome={
                                                                        deleteHome
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold mb-4">
                                        My Bookings
                                    </h2>
                                    {userBookings.length === 0 ? (
                                        <div>
                                            <p className="text-gray-500 mb-8">
                                                You don't have any bookings yet.
                                            </p>
                                            <Link
                                                to="/homes"
                                                className="border border-black hover:bg-black hover:text-white font-bold py-4 px-8 rounded-3xl transition duration-200 ease-in-out"
                                            >
                                                Start Booking
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                            {userBookings.map((booking) => (
                                                <div
                                                    key={booking._id}
                                                    className="bg-gray-lighter rounded-3xl p-6"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <HomeIcon
                                                                size="24"
                                                                color="#000"
                                                            />
                                                            <p>
                                                                <span className="text-black font-semibold">
                                                                    {
                                                                        booking
                                                                            .home
                                                                            .title
                                                                    }
                                                                </span>{" "}
                                                                ·{" "}
                                                                <span className="text-gray-500">
                                                                    {
                                                                        booking.totalPrice
                                                                    }
                                                                </span>{" "}
                                                                <span className="text-sm text-gray-500">
                                                                    NP
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div>
                                                            {new Date(
                                                                booking.checkIn
                                                            ) > new Date() ? (
                                                                <div className="flex items-center gap-2">
                                                                    {confirmDelete && (
                                                                        <p className="text-sm text-gray-500">
                                                                            Are
                                                                            you
                                                                            sure?
                                                                        </p>
                                                                    )}
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            onClick={
                                                                                !confirmDelete
                                                                                    ? handleConfirmDelete
                                                                                    : handleCancelBooking(
                                                                                          booking._id
                                                                                      )
                                                                            }
                                                                            className="text-xs font-bold py-1 px-2 border border-black bg-gray-200 text-black hover:bg-black hover:text-white rounded-xl"
                                                                        >
                                                                            {!confirmDelete
                                                                                ? "Cancel"
                                                                                : "Yes"}
                                                                        </button>
                                                                        {confirmDelete && (
                                                                            <button
                                                                                onClick={
                                                                                    handleConfirmDelete
                                                                                }
                                                                                className="text-xs font-bold py-1 px-2 border border-black bg-gray-200 text-black hover:bg-black hover:text-white rounded-xl"
                                                                            >
                                                                                No
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <Chip
                                                                        color="warning"
                                                                        variant="shadow"
                                                                        className="text-white"
                                                                    >
                                                                        <Clock
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </Chip>
                                                                </div>
                                                            ) : new Date(
                                                                  booking.checkIn
                                                              ) < new Date() &&
                                                              new Date(
                                                                  booking.checkOut
                                                              ) > new Date() ? (
                                                                <Chip
                                                                    color="primary"
                                                                    variant="shadow"
                                                                    className="text-white"
                                                                >
                                                                    <Play
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </Chip>
                                                            ) : (
                                                                <Chip
                                                                    color="success"
                                                                    variant="shadow"
                                                                    className="text-white"
                                                                >
                                                                    <Check
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </Chip>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-500 mt-4">
                                                        {new Date(
                                                            booking.checkIn
                                                        ).toLocaleDateString()}{" "}
                                                        -{" "}
                                                        {new Date(
                                                            booking.checkOut
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
            )}
        </>
    );
}

export default Profile;
