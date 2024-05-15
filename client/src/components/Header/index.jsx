import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    signOutUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} from "@redux/user/userSlice";
import axios from "axios";

// Icons
import TwoLineHorizontal from "@icons/two-line-horizontal";
import HomeAlt1 from "@icons/home-alt1";
import Map from "@icons/map";
import Money from "@icons/money";
import Person from "@icons/person";
import Bell from "@icons/bell";
import SignOut from "@icons/sign-out";

function Header() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenu = () => {
        const navMenu = document.getElementById("nav-menu-container");
        const openMenu = document.getElementById("open-menu");
        setIsMenuOpen(!isMenuOpen);
        openMenu.classList.toggle("rotate-90");

        navMenu.classList.toggle("hidden");

        if (isMenuOpen) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());

            const response = await axios.post("/api/auth/sign-out");

            dispatch(deleteUserSuccess(response.data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    return (
        <>
            <header className="absolute z-50 w-full bg-white">
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 items-center px-6 py-3 max-w-7xl mx-auto">
                    <div className="w-1/3 col-span-1">
                        <div className="w-fit">
                            <Link to="/">
                                <h1 className="font-extrabold uppercase text-2xl">
                                    Nomad
                                </h1>
                                <h1 className="font-extrabold uppercase text-2xl -mt-3">
                                    Shell
                                </h1>
                            </Link>
                        </div>
                    </div>
                    <nav
                        id="nav-menu-container"
                        className="bg-white w-full h-content md:h-auto col-span-1 md:col-span-2 hidden md:flex absolute top-header md:static items-center justify-between"
                    >
                        <ul className="flex flex-col md:flex-row md:items-center justify-center gap-8 my-8 md:my-0 px-6 md:px-0">
                            <Link
                                to="/homes"
                                className="w-full border-b-2 border-transparent md:hover:border-black py-2"
                            >
                                <li className="flex items-center space-x-2">
                                    <HomeAlt1 color="#000" size="24" />
                                    <span className="font-medium text-lg md:text-sm uppercase">
                                        Homes
                                    </span>
                                </li>
                            </Link>
                            <Link
                                to="/map"
                                className="border-b-2 border-transparent md:hover:border-black py-2"
                            >
                                <li className="flex items-center space-x-2">
                                    <Map color="#000" size="24" />
                                    <span className="font-medium text-lg md:text-sm uppercase">
                                        Map
                                    </span>
                                </li>
                            </Link>
                            <Link
                                to="/pricing"
                                className="border-b-2 border-transparent md:hover:border-black py-2"
                            >
                                <li className="flex items-center space-x-2">
                                    <Money color="#000" size="24" />
                                    <span className="font-medium text-lg md:text-sm uppercase">
                                        Pricing
                                    </span>
                                </li>
                            </Link>
                        </ul>
                        <ul className="flex flex-col md:flex-row md:items-center justify-center md:justify-end gap-8 md:gap-6 px-6 md:px-0">
                            {currentUser ? (
                                <>
                                    <Link
                                        to="/pricing"
                                        className="font-medium text-lg md:text-base uppercase text-nowrap"
                                    >
                                        {currentUser.user.nomadPoints} NP
                                    </Link>

                                    <a
                                        href="/profile"
                                        className="border-b-2 border-transparent py-2"
                                    >
                                        <li className="flex items-center space-x-2">
                                            <Person color="#000" size="24" />
                                            <span className="flex md:hidden font-medium text-lg md:text-sm uppercase">
                                                Profile
                                            </span>
                                        </li>
                                    </a>

                                    <a
                                        href="/notifications"
                                        className="border-b-2 border-transparent py-2"
                                    >
                                        <li className="flex items-center space-x-2">
                                            <Bell color="#000" size="24" />
                                            <span className="flex md:hidden font-medium text-lg md:text-sm uppercase">
                                                Notifications
                                            </span>
                                        </li>
                                    </a>

                                    <div
                                        onClick={handleSignOut}
                                        className="border-b-2 border-transparent py-2 cursor-pointer"
                                    >
                                        <li className="flex items-center space-x-2">
                                            <SignOut color="#000" size="24" />
                                            <span className="flex md:hidden font-medium text-lg md:text-sm uppercase">
                                                Logout
                                            </span>
                                        </li>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <a
                                        href="/sign-in"
                                        className="w-fit bg-black px-10 py-3 rounded-2xl md:hover:scale-105 transition duration-150 ease-in-out"
                                    >
                                        <li className="flex items-center space-x-2">
                                            <span className="flex font-bold text-lg text-white md:text-sm uppercase">
                                                JOIN
                                            </span>
                                        </li>
                                    </a>
                                </>
                            )}
                        </ul>
                    </nav>

                    <div className="flex md:hidden items-center justify-end">
                        <div className="cursor-pointer" onClick={handleMenu}>
                            <TwoLineHorizontal
                                color="#000"
                                size="32"
                                id="open-menu"
                                className="transition duration-200 ease-in-out"
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
