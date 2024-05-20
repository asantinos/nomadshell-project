import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateRangePicker } from "@nextui-org/react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Loader from "@components/Loader";
import Footer from "@components/Footer";

import Cross from "@icons/cross";

const HomeView = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { id } = useParams();
    const [home, setHome] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImagesSliderModalOpen, setIsImagesSliderModalOpen] =
        useState(false);
    const [initialSlide, setInitialSlide] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchHomeDetails = async () => {
            try {
                const { data } = await axios.get(`/api/homes/${id}`);
                setHome(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHomeDetails();
    }, [id]);

    useEffect(() => {
        if (isImagesSliderModalOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isImagesSliderModalOpen]);

    const handleImageClick = (index) => {
        setInitialSlide(index);
        setCurrentSlide(index);
        setIsImagesSliderModalOpen(true);
    };

    if (!home) {
        return <Loader />;
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="p-6 max-w-7xl mx-auto pt-header">
                        <div
                            className={`grid 
                        ${
                            home.images.length === 1
                                ? "grid-cols-6 grid-rows-1"
                                : ""
                        }
                        ${
                            home.images.length === 2
                                ? "grid-cols-6 grid-rows-1"
                                : ""
                        }
                        ${
                            home.images.length === 3
                                ? "grid-cols-6 grid-rows-2"
                                : ""
                        }
                        ${
                            home.images.length >= 4
                                ? "grid-cols-6 grid-rows-2"
                                : ""
                        }
                         gap-1 md:gap-2`}
                        >
                            <img
                                src={home.images[0]}
                                alt={home.title}
                                className="w-full h-full object-cover rounded-2xl md:rounded-3xl col-span-4 row-span-2 cursor-pointer"
                                onClick={() => handleImageClick(0)}
                            />
                            {home.images.length >= 2 && (
                                <img
                                    src={home.images[1]}
                                    alt={home.title}
                                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl col-span-2 cursor-pointer"
                                    onClick={() => handleImageClick(1)}
                                />
                            )}
                            {home.images.length === 3 && (
                                <img
                                    src={home.images[2]}
                                    alt={home.title}
                                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl col-span-2 cursor-pointer"
                                    onClick={() => handleImageClick(2)}
                                />
                            )}
                            {home.images.length > 3 && (
                                <img
                                    src={home.images[2]}
                                    alt={home.title}
                                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl cursor-pointer"
                                    onClick={() => handleImageClick(2)}
                                />
                            )}
                            {home.images.length === 4 && (
                                <img
                                    src={home.images[3]}
                                    alt={home.title}
                                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl cursor-pointer"
                                    onClick={() => handleImageClick(3)}
                                />
                            )}
                            {home.images.length > 4 && (
                                <div
                                    onClick={() => handleImageClick(3)}
                                    className="relative w-full h-full object-cover rounded-2xl md:rounded-3xl"
                                >
                                    <img
                                        src={home.images[3]}
                                        alt={home.title}
                                        className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 rounded-3xl cursor-pointer">
                                        + {home.images.length - 4}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <h1 className="text-3xl font-semibold">
                                {home.title}
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                {home.description}
                            </p>
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold">
                                    Details
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">
                                        Location:
                                    </span>{" "}
                                    {home.location}
                                </p>
                                <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">
                                        Price:
                                    </span>{" "}
                                    {home.price} NP / night
                                </p>
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold">
                                        Features
                                    </h2>
                                    <ul className="mt-2 text-gray-600">
                                        {home.parking && (
                                            <li>
                                                <span className="font-semibold">
                                                    Parking
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {currentUser && currentUser.user._id !== home.owner._id && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold">
                                    Book now
                                </h2>
                                <DateRangePicker
                                    variant="bordered"
                                    isRequired
                                    label="Select a date"
                                    visibleMonths={2}
                                    onChange={(date) => console.log(date)}
                                />
                                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-3xl">
                                    Book now
                                </button>
                            </div>
                        )}
                    </div>
                    <Footer />
                </>
            )}

            {isImagesSliderModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
                    onClick={() => setIsImagesSliderModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 md:top-4 right-2 md:right-4 p-2 z-50 bg-white text-2xl rounded-full"
                            onClick={() => setIsImagesSliderModalOpen(false)}
                        >
                            <div className="hidden md:block">
                                <Cross size={18} />
                            </div>
                            <div className="block md:hidden">
                                <Cross size={14} />
                            </div>
                        </button>
                        <Swiper
                            slidesPerView={1}
                            initialSlide={initialSlide}
                            onSlideChange={(swiper) =>
                                setCurrentSlide(swiper.realIndex)
                            }
                            loop
                        >
                            {home.images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={image}
                                        alt={`Slide ${index}`}
                                        className="w-full h-full object-cover max-h-[25vh] md:max-h-[50vh] lg:max-h-[60vh]"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="absolute top-2 md:top-4 left-2 md:left-4 p-2 z-50 bg-white text-sm font-semibold rounded-2xl">
                            {currentSlide + 1} / {home.images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeView;
