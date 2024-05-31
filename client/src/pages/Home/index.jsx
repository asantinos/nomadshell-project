import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";

import Footer from "@components/Footer";
import Button from "@components/Button";
import IconChip from "@components/IconChip";
import HomeCard from "@components/Homes/HomeCard";
import Gift from "@icons/gift";
import Plane from "@icons/plane";
import ArrowCycle from "@icons/arrow-cycle";
import HomeIcon from "@icons/home";

function Home() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [promotedHomes, setPromotedHomes] = useState([]);

    useEffect(() => {
        const fetchHomes = async () => {
            try {
                const response = await axios.get("/api/homes/all");
                const randomHomes = response.data
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);
                setPromotedHomes(randomHomes);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHomes();
    }, []);

    return (
        <>
            <main className="h-auto pt-header">
                {/* MAIN BANNER */}
                <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 p-6 py-0 sm:py-3 gap-x-20">
                    <div>
                        <div className="text-5xl sm:text-7xl font-extrabold leading-tight">
                            <h2>Host.</h2>
                            <h2>Travel.</h2>
                            <h2>Relax.</h2>
                            <h2>Explore.</h2>
                        </div>
                        <p className="text-lg text-justify mt-8">
                            Find great places to stay, swap homes and travel
                            better together.
                        </p>
                        <p className="text-lg text-justify mt-4">
                            Nomadshell is a community of travelers and hosts who
                            believe that traveling shouldn't come at the expense
                            of living. We're here to help you find your next
                            adventure, wherever that may be.
                        </p>

                        <IconChip
                            background={"gradient-radial"}
                            icon={<Gift color="#000" size={24} />}
                        >
                            Get $50 off your first trip
                        </IconChip>

                        <div className="mt-8 flex justify-center sm:justify-start">
                            <Button
                                onClick={() =>
                                    currentUser
                                        ? navigate("/homes")
                                        : navigate("/sign-up")
                                }
                                className="border-main-dark bg-main-dark hover:border-main-light hover:bg-main-light text-white font-bold"
                            >
                                Get Started
                            </Button>
                            <Button
                                onClick={() => navigate("/terms")}
                                className="ml-4 border-gray-light text-gray-light hover:border-gray-dark hover:text-gray-dark"
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>

                    <div className="hidden md:block h-banner-image overflow-hidden rounded-3xl">
                        <img
                            src="https://images.unsplash.com/photo-1671340525263-868bc444810b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Nomadshell Banner"
                            className="h-full w-full object-cover hover:scale-105 transition duration-500 ease"
                        />
                    </div>
                </section>

                {/* ADVANTAGES CARDS */}
                <section className="my-16 md:my-32 bg-gray-lighter">
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <HomeIcon color="#000" size={48} />
                                <h3 className="text-3xl font-bold mt-4">
                                    Stay
                                </h3>
                                <p className="text-lg mt-4">
                                    Find unique places to stay with local hosts
                                    in 191 countries.
                                </p>
                            </div>
                            <div>
                                <ArrowCycle color="#000" size={48} />
                                <h3 className="text-3xl font-bold mt-4">
                                    Swap
                                </h3>
                                <p className="text-lg mt-4">
                                    Swap homes with other travelers and save on
                                    accommodation.
                                </p>
                            </div>
                            <div>
                                <Plane color="#000" size={48} />
                                <h3 className="text-3xl font-bold mt-4">
                                    Travel
                                </h3>
                                <p className="text-lg mt-4">
                                    Travel better together with our community of
                                    like-minded explorers.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="mt-10">
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">Testimonials</h3>
                            <p className="text-lg mt-4">
                                What our users are saying about Nomadshell
                            </p>
                        </div>

                        <div className="mt-8">
                            <Swiper
                                spaceBetween={30}
                                loop={true}
                                className="mySwiper p-3"
                            >
                                <SwiperSlide>
                                    <div className="shadow-medium p-6 rounded-2xl">
                                        <p className="text-lg">
                                            "Nomadshell is the best thing that
                                            ever happened to me. I've met so
                                            many amazing people and stayed in
                                            some incredible places."
                                        </p>
                                        <p className="flex items-center gap-2 text-lg mt-4 font-bold">
                                            <img
                                                src="https://placehold.co/50"
                                                alt="John Doe"
                                                className="w-8 h-8 rounded-full inline-block mr-2"
                                            />
                                            - John Doe
                                        </p>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="shadow-medium p-6 rounded-2xl">
                                        <p className="text-lg">
                                            "I've been using Nomadshell for
                                            years and it's always been a great
                                            experience. I love the community and
                                            the places I've stayed at."
                                        </p>
                                        <p className="flex items-center gap-2 text-lg mt-4 font-bold">
                                            <img
                                                src="https://placehold.co/50"
                                                alt="Jane Doe"
                                                className="w-8 h-8 rounded-full inline-block mr-2"
                                            />
                                            - Jane Doe
                                        </p>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="shadow-medium p-6 rounded-2xl">
                                        <p className="text-lg">
                                            "I've been using Nomadshell for
                                            years and it's always been a great
                                            experience. I love the community and
                                            the places I've stayed at."
                                        </p>
                                        <p className="flex items-center gap-2 text-lg mt-4 font-bold">
                                            <img
                                                src="https://placehold.co/50"
                                                alt="Jane Doe"
                                                className="w-8 h-8 rounded-full inline-block mr-2"
                                            />
                                            - Jane Doe
                                        </p>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="shadow-medium p-6 rounded-2xl">
                                        <p className="text-lg">
                                            "I've been using Nomadshell for
                                            years and it's always been a great
                                            experience. I love the community and
                                            the places I've stayed at."
                                        </p>
                                        <p className="flex items-center gap-2 text-lg mt-4 font-bold">
                                            <img
                                                src="https://placehold.co/50"
                                                alt="Jane Doe"
                                                className="w-8 h-8 rounded-full inline-block mr-2"
                                            />
                                            - Jane Doe
                                        </p>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="shadow-medium p-6 rounded-2xl">
                                        <p className="text-lg">
                                            "I've been using Nomadshell for
                                            years and it's always been a great
                                            experience. I love the community and
                                            the places I've stayed at."
                                        </p>
                                        <p className="flex items-center gap-2 text-lg mt-4 font-bold">
                                            <img
                                                src="https://placehold.co/50"
                                                alt="Jane Doe"
                                                className="w-8 h-8 rounded-full inline-block mr-2"
                                            />
                                            - Jane Doe
                                        </p>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="shadow-medium p-6 rounded-2xl">
                                        <p className="text-lg">
                                            "I've been using Nomadshell for
                                            years and it's always been a great
                                            experience. I love the community and
                                            the places I've stayed at."
                                        </p>
                                        <p className="flex items-center gap-2 text-lg mt-4 font-bold">
                                            <img
                                                src="https://placehold.co/50"
                                                alt="Jane Doe"
                                                className="w-8 h-8 rounded-full inline-block mr-2"
                                            />
                                            - Jane Doe
                                        </p>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-10 bg-gradient-radial text-center py-20">
                    <h3 className="text-4xl font-bold">
                        Ready to start your adventure?
                    </h3>
                    <p className="text-lg mt-4">
                        Join Nomadshell and start exploring the world today.
                    </p>
                    <button
                        onClick={() =>
                            currentUser
                                ? navigate("/homes")
                                : navigate("/sign-up")
                        }
                        className="mt-8 border border-black hover:bg-black hover:text-white font-bold py-4 px-8 rounded-3xl transition duration-200 ease-in-out"
                    >
                        Get Started
                    </button>
                </section>

                {/* PROMOTED DESTINATIONS */}
                <section className="mt-10">
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">
                                Promoted Destinations
                            </h3>
                            <p className="text-lg mt-4">
                                Check out some of our favorite destinations
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {promotedHomes.map((home) => (
                                <HomeCard key={home._id} home={home} />
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}

export default Home;
