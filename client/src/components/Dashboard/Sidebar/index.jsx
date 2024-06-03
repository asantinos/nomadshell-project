import React from "react";
import { Link, useParams } from "react-router-dom";

import Person from "@icons/person";
import Home from "@icons/home";
import BookOpen from "@icons/book-open";
import Money from "@icons/money";

function Sidebar() {
    let { section } = useParams();

    return (
        <div className="fixed bottom-4 md:bottom-0 left-[50%] md:left-0 -translate-x-[50%] md:-translate-x-0 z-10 bg-white border p-2 md:p-0 md:border-y-0 md:border-l-0 rounded-3xl md:rounded-none md:relative md:min-h-content md:border-r md:pr-8 shadow-md md:shadow-none">
            <h1 className="hidden md:block text-3xl font-bold">Dashboard</h1>
            <ul className="flex gap-1 md:gap-0 md:flex-col items-center md:items-start md:mt-8">
                <li className="md:mb-2">
                    <Link
                        to="/dashboard/users"
                        className={`flex items-center p-4 rounded-3xl font-semibold hover:bg-black hover:text-white ${
                            section === "users" ? "bg-black text-white" : ""
                        }`}
                    >
                        <span className="md:mr-2">
                            <Person size={22} color="currentColor" />
                        </span>
                        <span className="hidden md:block">Users</span>
                    </Link>
                </li>
                <li className="md:mb-2">
                    <Link
                        to="/dashboard/homes"
                        className={`flex items-center p-4 rounded-3xl font-semibold hover:bg-black hover:text-white ${
                            section === "homes" ? "bg-black text-white" : ""
                        }`}
                    >
                        <span className="md:mr-2">
                            <Home size={22} color="currentColor" />
                        </span>
                        <span className="hidden md:block">Homes</span>
                    </Link>
                </li>
                <li className="md:mb-2">
                    <Link
                        to="/dashboard/bookings"
                        className={`flex items-center p-4 rounded-3xl font-semibold hover:bg-black hover:text-white ${
                            section === "bookings" ? "bg-black text-white" : ""
                        }`}
                    >
                        <span className="md:mr-2">
                            <BookOpen size={22} color="currentColor" />
                        </span>
                        <span className="hidden md:block">Bookings</span>
                    </Link>
                </li>
                <li className="md:mb-2">
                    <Link
                        to="/dashboard/nomadpoints"
                        className={`flex items-center p-4 rounded-3xl font-semibold hover:bg-black hover:text-white ${
                            section === "nomadpoints" ? "bg-black text-white" : ""
                        }`}
                    >
                        <span className="md:mr-2">
                            <Money size={22} color="currentColor" />
                        </span>
                        <span className="hidden md:block">NomadPoints</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
