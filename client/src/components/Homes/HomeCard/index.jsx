import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarIcon, Tooltip } from "@nextui-org/react";
import axios from "axios";

import Location from "@icons/location";

import Heart from "@icons/heart";
import HeartFill from "@icons/heart-fill";

const HomeCard = ({ home }) => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [isHovered, setIsHovered] = useState(false);
    const [location, setLocation] = useState({
        city: "",
        country: "",
    });
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
            const { lat, lng } = {
                lat: home.location[1],
                lng: home.location[0],
            };
            try {
                const response = await axios.get(
                    `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${apiKey}&radius=100`
                );
                const address = response.data.addresses[0].address;
                setLocation({
                    city: address.municipality,
                    country: address.country,
                });
            } catch (error) {
                console.error(error);
            }
        };

        if (!location.city && !location.country) {
            fetchLocation();
        }
    }, [home.location, location]);

    useEffect(() => {
        if (currentUser) {
            const isFavorite = currentUser.user.favorites.includes(home._id);
            setIsFavorite(isFavorite);
        }
    }, [currentUser, home._id, isFavorite]);

    // Toggle favorite with api call /api/users/toggleFavorite/:id (id = home._id)
    const toggleFavorite = async () => {
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }

        try {
            const response = await axios.post(
                `/api/users/toggleFavorite/${home._id}`
            );
            setIsFavorite((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="relative overflow-hidden rounded-3xl">
                <Link
                    to={`/homes/${home._id}`}
                    className="w-full h-full"
                    key={home._id}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        src={home.images[0]}
                        alt={home.title}
                        loading="lazy"
                        className={`w-full h-64 object-cover object-center transform transition-transform duration-200 ease-in-out ${
                            isHovered ? "scale-105" : "scale-100"
                        }`}
                    />
                </Link>

                <Tooltip
                    content={
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-black">
                                {home.owner.name} {home.owner.surname}
                            </p>
                            <p className="text-xs font-normal text-gray-dark -mt-1">
                                {home.owner.planType.charAt(0).toUpperCase() +
                                    home.owner.planType.slice(1)}
                            </p>
                        </div>
                    }
                    closeDelay={0}
                    placement="right"
                >
                    <div className="absolute top-3 left-3 shadow-md">
                        <Link
                            to={
                                currentUser &&
                                currentUser.user._id === home.owner._id
                                    ? "/profile"
                                    : `/users/${home.owner._id}`
                            }
                        >
                            <Avatar
                                isBordered
                                radius="lg"
                                color={
                                    home.owner.planType === "free"
                                        ? "success"
                                        : home.owner.planType === "explorer"
                                        ? "primary"
                                        : home.owner.planType === "adventurer"
                                        ? "warning"
                                        : home.owner.planType === "nomad"
                                        ? "secondary"
                                        : "default"
                                }
                                src={home.owner.avatar}
                                name={home.owner.name}
                                size="sm"
                                fallback={<AvatarIcon />}
                            />
                        </Link>
                    </div>
                </Tooltip>

                {currentUser?.user._id !== home.owner._id || !currentUser ? (
                    <div className="absolute top-3 right-3">
                        <Tooltip
                            content={
                                isFavorite
                                    ? "Remove from favorites"
                                    : "Save to favorites"
                            }
                            closeDelay={0}
                            placement="left"
                        >
                            <button
                                onClick={toggleFavorite}
                                className="p-2 bg-white rounded-full shadow-md"
                            >
                                {isFavorite ? (
                                    <HeartFill color="#FF385C" size={24} />
                                ) : (
                                    <Heart color="#FF385C" size={24} />
                                )}
                            </button>
                        </Tooltip>
                    </div>
                ) : null}
            </div>

            <div className="mt-2 ml-2">
                <h3 className="text-xl font-bold text-black">
                    <span className="text-2xl mr-1">{home.price}</span>
                    NP
                    <span className="font-normal text-sm text-gray-dark">
                        {" "}
                        / night
                    </span>
                </h3>
                <div className="flex items-center gap-1 mt-1">
                    <p className="font-semibold text-gray-dark">{home.title}</p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <Location color={"#9194A1"} size={16} />
                    <p className="text-sm font-medium text-gray-light">
                        {location.city}, {location.country}
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-2 text-gray-light font-normal">
                    <div className="flex items-center gap-1">
                        <p className="text-sm">{home.bedrooms} bedrooms</p>
                    </div>
                    ·
                    <div className="flex items-center gap-1">
                        <p className="text-sm">{home.bathrooms} bathrooms</p>
                    </div>
                    ·
                    <div className="flex items-center gap-1">
                        <p className="text-sm">{home.sqrt} m²</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm font-medium text-gray-dark">
                        {home.type}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomeCard;
