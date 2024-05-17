import React, { useEffect, useState } from "react";
import axios from "axios";

const HomeCard = ({ home }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex items-center">
                <img
                    className="w-10 h-10 rounded-full mr-4"
                    src={home.images[0]}
                    alt={home.title}
                />
                <div>
                    <h2 className="text-lg font-semibold">{home.title}</h2>
                    <p className="text-gray-500">{home.location}</p>
                </div>

                <div className="ml-auto">
                    <p className="text-gray-500">{home.price}</p>
                </div>
            </div>
        </div>
    );
};

const Homes = () => {
    const [homes, setHomes] = useState([]);

    useEffect(() => {
        axios
            .get("/api/homes/all")
            .then((response) => setHomes(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {homes.map((home, index) => (
                <HomeCard key={index} home={home} />
            ))}
        </div>
    );
};

export default Homes;
