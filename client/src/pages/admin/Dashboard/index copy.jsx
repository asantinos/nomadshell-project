import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} from "@redux/user/userSlice";
import { Link } from "react-router-dom";
import axios from "axios";

import Sidebar from "@components/Dashboard/Sidebar";
import Footer from "@components/Footer";

function Dashboard() {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user);

    const [users, setUsers] = useState([]);
    const [homes, setHomes] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("/api/users/all");
                setUsers(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchHomes = async () => {
            try {
                const res = await axios.get("/api/homes/all");
                setHomes(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
        fetchHomes();
    }, []);

    const handleDeleteUser = async (userId) => {
        setUserIdToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteConfirmation === "delete") {
            try {
                dispatch(deleteUserStart());

                const res = await axios.delete(
                    `/api/users/delete/${userIdToDelete}`
                );

                dispatch(deleteUserSuccess(res.data));

                // Close modal after successful deletion
                setIsDeleteModalOpen(false);
                setUserIdToDelete(null);
                setDeleteConfirmation("");

                // Update users list
                setUsers(users.filter((user) => user._id !== userIdToDelete));
            } catch (error) {
                if (error.response) {
                    dispatch(deleteUserFailure(error.response.data.message));
                } else {
                    dispatch(deleteUserFailure(error.message));
                }
            }
        }
    };

    return (
        <>
            <main className="h-auto pt-header">
                <section>
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="flex gap-16">
                            <Sidebar />

                            {/* Tables for users and homes */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Users
                                </h2>
                                <table className="w-full mt-4">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Name</th>
                                            <th className="text-left">Email</th>
                                            <th className="text-left">
                                                Plan Type
                                            </th>
                                            <th className="text-left">Role</th>
                                            <th className="text-left">
                                                Number of Homes
                                            </th>
                                            <th className="text-left">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td>
                                                    {user.name} {user.surname}
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{user.planType}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    {
                                                        homes.filter(
                                                            (home) =>
                                                                home.owner ===
                                                                user._id
                                                        ).length
                                                    }
                                                </td>
                                                <td>
                                                    <button className="text-blue-500">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user._id
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                                    Homes
                                </h2>

                                <table className="w-full mt-4">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Title</th>
                                            <th className="text-left">
                                                Location
                                            </th>
                                            <th className="text-left">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {homes.map((home) => (
                                            <tr key={home._id}>
                                                <td>{home.title}</td>
                                                <td>{home.location}</td>
                                                <td>{home.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Delete Confirmation Modal */}
                                {isDeleteModalOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                                        <div className="bg-white p-6 rounded-3xl">
                                            <p>
                                                Are you sure you want to{" "}
                                                <span className="font-bold">
                                                    delete
                                                </span>{" "}
                                                your account?
                                            </p>
                                            <p>Type 'delete' to confirm:</p>
                                            <input
                                                type="text"
                                                value={deleteConfirmation}
                                                autoFocus
                                                onChange={(e) =>
                                                    setDeleteConfirmation(
                                                        e.target.value
                                                    )
                                                }
                                                className="border border-gray-300 rounded-2xl p-2 mt-4"
                                            />
                                            <div className="flex justify-end gap-2 mt-8">
                                                <button
                                                    onClick={() =>
                                                        setIsDeleteModalOpen(
                                                            false
                                                        )
                                                    }
                                                    onMouseDown={() =>
                                                        setDeleteConfirmation(
                                                            ""
                                                        )
                                                    }
                                                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl hover:bg-gray-200"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={confirmDelete}
                                                    disabled={
                                                        deleteConfirmation !==
                                                        "delete"
                                                    }
                                                    className={`bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 ${
                                                        deleteConfirmation !==
                                                            "delete" &&
                                                        "opacity-50 cursor-not-allowed"
                                                    }`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Dashboard;
