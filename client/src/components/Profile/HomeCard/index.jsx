import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DateRangePicker } from "@nextui-org/react";
import { today, parseDate } from "@internationalized/date";
import axios from "axios";

import EditButton from "@components/Button/EditButton";
import DeleteButton from "@components/Button/DeleteButton";

import Location from "@icons/location";
import Plus from "@icons/plus";
import ArrowRepeat from "@icons/arrow-repeat";
import Cross from "@icons/cross";

function ProfileHomeCard({ home, deleteHome }) {
    const navigate = useNavigate();
    const [location, setLocation] = useState({
        city: "",
        country: "",
    });
    const [availableDates, setAvailableDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [calendarValue, setCalendarValue] = useState(null);

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

        fetchLocation();
    }, [home.location]);

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
                    className="flex items-center gap-2 mb-4"
                >
                    <img
                        src={home.images[0]}
                        alt={home.title}
                        className="h-10 w-10 object-cover rounded-2xl"
                    />
                    <span className="text-black font-bold">{home.title}</span>
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
            <p className="text-gray-500 text-sm -mt-1">{home.description}</p>
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
            <p className="font-normal text-sm text-gray-light mt-2">
                {home.parking ? "Parking" : "No parking"}
            </p>
            <div className="flex items-center gap-4 mt-2">
                <p className="text-sm font-medium text-gray-dark">
                    {home.type}
                </p>
            </div>
            <h3 className="text-xl font-bold text-black mt-4">
                <span className="text-xl mr-1">{home.price}</span>
                NP
                <span className="font-normal text-sm text-gray-dark">
                    {" "}
                    / night
                </span>
            </h3>
            <div className="mt-4">
                <div className="flex items-center gap-2 mt-2 text-sm">
                    {availableDates.length === 0 ? (
                        <p className="text-red-500 font-semibold">
                            Home is not available yet
                        </p>
                    ) : (
                        <p>
                            Available from{" "}
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

                    <div className="flex flex-col sm:flex-row gap-1">
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
        </div>
    );
}

export default ProfileHomeCard;
