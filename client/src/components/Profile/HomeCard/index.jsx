import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DateRangePicker } from "@nextui-org/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import axios from "axios";
import { format } from "date-fns";

import EditButton from "@components/Button/EditButton";
import DeleteButton from "@components/Button/DeleteButton";

import Plus from "@icons/plus";
import ArrowRepeat from "@icons/arrow-repeat";
import Cross from "@icons/cross";

function ProfileHomeCard({ home, deleteHome }) {
    const navigate = useNavigate();
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedRange, setSelectedRange] = useState(null);

    useEffect(() => {
        axios
            .get(`/api/availableDates/${home._id}`)
            .then((res) => {
                setAvailableDates(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [home._id]);

    const handleDateChange = (range) => {
        setSelectedRange(range);
    };

    const handleAddDates = () => {
        if (!selectedRange) return;

        const { start, end } = selectedRange;

        const startDate = new Date(start.year, start.month - 1, start.day);
        const endDate = new Date(end.year, end.month - 1, end.day);

        let datesToAdd = [];

        for (
            let date = new Date(startDate);
            date <= endDate;
            date.setDate(date.getDate() + 1)
        ) {
            datesToAdd.push(format(date, "yyyy-MM-dd"));
        }

        axios
            .post(`/api/availableDates/${home._id}`, {
                dates: datesToAdd,
            })
            .then((res) => {
                setAvailableDates(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDeleteDates = () => {
        axios
            .delete(`/api/availableDates/${home._id}`)
            .then(() => {
                setAvailableDates([]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

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
                Coords: [{home.location[0]}
                {", "}
                {home.location[1]}]
            </p>
            <div className="mt-4">
                {availableDates.length === 0 ? (
                    <p className="text-red-500  font-semibold">
                        Not available yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p>
                            Your home will be available from{" "}
                            <span className="font-semibold">
                                {format(
                                    new Date(availableDates[0].date),
                                    "dd/MM/yyyy"
                                )}
                            </span>
                            {" to "}
                            <span className="font-semibold">
                                {format(
                                    new Date(
                                        availableDates[
                                            availableDates.length - 1
                                        ].date
                                    ),
                                    "dd/MM/yyyy"
                                )}
                            </span>
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                    <DateRangePicker
                        variant="bordered"
                        label="When is your home available?"
                        visibleMonths={1}
                        minValue={today(getLocalTimeZone()).add(
                            { days: 1 } // Tomorrow
                        )}
                        onChange={handleDateChange}
                    />

                    <button
                        onClick={handleAddDates}
                        className="bg-gray-dark hover:bg-black text-white font-semibold p-2 rounded-2xl"
                    >
                        {availableDates.length === 0 ? <Plus size={20} /> : <ArrowRepeat size={20} />}
                    </button>

                    {availableDates.length > 0 && (
                        <button
                            onClick={handleDeleteDates}
                            className="bg-red-500 hover:bg-red-700 text-white font-semibold p-2 rounded-2xl"
                        >
                            <Cross size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileHomeCard;
