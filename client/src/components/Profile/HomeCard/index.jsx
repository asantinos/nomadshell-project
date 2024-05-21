import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DateRangePicker } from "@nextui-org/react";
import { today, parseDate } from "@internationalized/date";
import axios from "axios";

import EditButton from "@components/Button/EditButton";
import DeleteButton from "@components/Button/DeleteButton";

import Plus from "@icons/plus";
import ArrowRepeat from "@icons/arrow-repeat";
import Cross from "@icons/cross";

function ProfileHomeCard({ home, deleteHome }) {
    const navigate = useNavigate();
    const [availableDates, setAvailableDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [calendarValue, setCalendarValue] = useState(null);

    useEffect(() => {
        const fetchAvailableDates = async () => {
            try {
                const { data } = await axios.get(
                    `/api/homes/${home._id}/availableDates`
                );

                if (data.length === 0) {
                    return;
                }

                setAvailableDates(data[0]);
                setStartDate(data[0].startDate.split("T")[0]);
                setEndDate(data[0].endDate.split("T")[0]);
                setCalendarValue({
                    start: parseDate(data[0].startDate.split("T")[0]),
                    end: parseDate(data[0].endDate.split("T")[0]),
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchAvailableDates();
    }, [availableDates, startDate, endDate, home._id]);

    const addOrUpdateAvailableDate = async () => {
        try {
            const { data } = await axios.post("/api/availableDates/create", {
                home: home._id,
                startDate: selectedStartDate,
                endDate: selectedEndDate,
            });
            setAvailableDates(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectedChange = (value) => {
        const formatDate = (date) => {
            const jsDate = new Date(
                Date.UTC(date.year, date.month - 1, date.day)
            );
            return jsDate.toISOString();
        };

        setSelectedStartDate(formatDate(value.start));
        setSelectedEndDate(formatDate(value.end));
    };

    const handleDeleteAvailableDate = async () => {
        if (availableDates.length === 0) {
            return;
        }

        try {
            await axios.delete(
                `/api/availableDates/delete/${availableDates._id}`
            );
            setAvailableDates([]);
            setStartDate(null);
            setEndDate(null);
            setCalendarValue(null);
        } catch (error) {
            console.error(error);
        }
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
                Coords: [{home.location[0]}, {home.location[1]}]
            </p>
            <div className="mt-4">
                <div className="flex items-center gap-2 mt-2 text-sm">
                    {availableDates.length === 0 ? (
                        <p className="text-red-500 font-semibold">
                            Home is not available yet
                        </p>
                    ) : (
                        <p>
                            Home will be available from{" "}
                            <span className="font-semibold">{startDate}</span>{" "}
                            and <span className="font-semibold">{endDate}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <DateRangePicker
                        variant="bordered"
                        label="When is your home available?"
                        visibleMonths={1}
                        onChange={handleSelectedChange}
                        minValue={today().add({ days: 1 })} // Tomorrow
                        value={
                            !selectedStartDate &&
                            !selectedEndDate &&
                            calendarValue
                        }
                    />

                    <button
                        className="bg-gray-dark hover:bg-black text-white p-2 rounded-2xl"
                        onClick={addOrUpdateAvailableDate}
                    >
                        {availableDates.length === 0 ? (
                            <Plus size={20} />
                        ) : (
                            <ArrowRepeat size={20} />
                        )}
                    </button>
                    {availableDates.length !== 0 && (
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-2xl"
                            onClick={handleDeleteAvailableDate}
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
