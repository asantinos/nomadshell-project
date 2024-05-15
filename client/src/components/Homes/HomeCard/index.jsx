import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Location from "@icons/location";
import Key from "@icons/key";
import axios from "axios";

const HomeCard = ({ home }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [owner, setOwner] = useState({});

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await axios.get(
                    `/api/users/get/${home.owner}`
                );
                setOwner(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOwner();
    }, [home.owner]);

    return (
        <div className="overflow-hidden">
            <img
                src={home.images[0]}
                alt={home.title}
                loading="lazy"
                className="w-full h-64 object-cover object-center rounded-3xl overflow-hidden"
            />

            <div className="mt-2 ml-2">
                <h3 className="text-xl font-bold text-black">
                    <span className="text-2xl mr-1">{home.price}</span>NP
                    <span className="font-normal text-sm text-gray-dark">
                        {" "}
                        / night
                    </span>
                </h3>

                <div className="flex items-center gap-1 mt-1">
                    <Location color={"#9194A1"} size={16} />
                    <p className="text-sm font-medium text-gray-light">
                        {home.location[0]}, {home.location[1]}
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

                <div className="mt-2">
                    <a
                        href={`/users/${owner._id}`}
                        className="w-fit flex items-center gap-1 text-sm font-medium text-gray-light hover:text-black transition duration-150 ease-in-out"
                    >
                        <Key color={"#000"} size={16} />
                        {currentUser?._id === owner._id
                            ? "Your home"
                            : owner.name}
                        <span className="ml-2">{owner.email}</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HomeCard;
