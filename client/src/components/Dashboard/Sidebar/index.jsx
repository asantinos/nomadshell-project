import React from "react";
import { Link, useParams } from "react-router-dom";

import Person from "@icons/person";
import Home from "@icons/home";
import BookOpen from "@icons/book-open";

function Sidebar() {
    let { section } = useParams();

    return (
        <div className="min-w-64 min-h-content border-r pr-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <ul className="flex flex-col mt-8">
                <li className="mb-2">
                    <Link
                        to="/dashboard/users"
                        className={`flex items-center p-4 rounded-3xl font-semibold hover:bg-black hover:text-white ${
                            section === "users" ? "bg-black text-white" : ""
                        }`}
                    >
                        <span className="mr-2">
                            <Person size={22} color="currentColor" />
                        </span>
                        Users
                    </Link>
                </li>
                <li className="mb-2">
                    <Link
                        to="/dashboard/homes"
                        className={`flex items-center p-4 rounded-3xl font-semibold hover:bg-black hover:text-white ${
                            section === "homes" ? "bg-black text-white" : ""
                        }`}
                    >
                        <span className="mr-2">
                            <Home size={22} color="currentColor" />
                        </span>
                        Homes
                    </Link>
                </li>
                {/* <li className="mb-2">
                    <Link
                        to="dashboard/bookings"
                        className="flex items-center p-4 rounded-3xl font-semibold hover:bg-black hover:text-white"
                    >
                        <span className="mr-2">
                            <BookOpen size={22} color="currentColor" />
                        </span>
                        Bookings
                    </Link>
                </li> */}
            </ul>
        </div>
    );
}

export default Sidebar;
