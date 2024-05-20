import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import axios from "axios";

import EditButton from "@components/Button/EditButton";
import DeleteButton from "@components/Button/DeleteButton";

import Plus from "@icons/plus";
import ArrowRepeat from "@icons/arrow-repeat";
import Cross from "@icons/cross";

function ProfileHomeCard({ home, deleteHome }) {
    const navigate = useNavigate();
    const [availableDate, setAvailableDate] = useState({
        start: parseDate("2024-05-21"),
        end: parseDate("2024-05-23"),
    });

    let formatter = useDateFormatter({ dateStyle: "long" });

    return (
        <div key={home._id} className="bg-gray-lighter rounded-3xl p-6">
            <div className="flex items-center justify-between">
                <Link
                    to={`/homes/${home._id}`}
                    className="text-black font-bold"
                >
                    {home.title}
                </Link>
                <div className="flex items-center gap-1">
                    <EditButton
                        onClick={() =>
                            navigate(`/profile/homes/edit/${home._id}`)
                        }
                    />
                    <DeleteButton onClick={() => deleteHome(home._id)} />
                </div>
            </div>
            <p className="text-gray-500 mt-4">{home.description}</p>
            <p className="text-gray-500 mt-4">{home.type}</p>
            <p className="text-gray-500 mt-4">{home.price} / night</p>
            <p className="text-gray-500 mt-4">{home.sqrt} sqrt</p>
            <p className="text-gray-500 mt-4">{home.bedrooms} bedrooms</p>
            <p className="text-gray-500 mt-4">{home.bathrooms} bathrooms</p>
            <p className="text-gray-500 mt-4">
                {home.parking ? "Parking 🚗" : "No parking"}
            </p>
            <p className="text-gray-500 mt-4">
                Coords: [{home.location[0]}, {home.location[1]}]
            </p>
            <div className="mt-4">
                <div className="flex items-baseline lg:items-center gap-2 mt-2">
                    <DateRangePicker
                        variant="bordered"
                        label="When is your home available?"
                        // value={availableDate}
                        onChange={setAvailableDate}
                        // onChange={handleDateChange}
                        visibleMonths={1}
                        minValue={new Date()} // Tomorrow
                    />
                    <div className="flex flex-col lg:flex-row gap-1 lg:gap-2">
                        <button
                            className={`bg-${
                                availableDate ? "red-500" : "gray-dark"
                            } hover:bg-${
                                availableDate ? "red-700" : "black"
                            } text-white font-semibold p-2 rounded-2xl`}
                        >
                            {availableDate ? (
                                <Cross size={20} />
                            ) : (
                                <Plus size={20} />
                            )}
                        </button>
                        {availableDate && (
                            <button className="bg-gray-dark hover:bg-black text-white font-semibold p-2 rounded-2xl">
                                <ArrowRepeat size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileHomeCard;
