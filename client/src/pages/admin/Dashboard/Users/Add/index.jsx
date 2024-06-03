import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminAddUser() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        surname: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);

            const res = await axios.post("/api/auth/sign-up", formData);

            if (res.status === 201) {
                navigate("/dashboard/users");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(error.message);
            }
        }
    };

    return (
        <main className="h-auto pt-header">
            <div>
                <section>
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h3 className="text-4xl font-bold">
                                Add a new user
                            </h3>
                            <p className="text-lg mt-4">
                                Complete all the fields to add a new user
                            </p>
                        </div>

                        <div className="mt-8 w-full">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 max-w-md mx-auto"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-2xl shadow-sm sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="surname"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Surname
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="surname"
                                                name="surname"
                                                type="text"
                                                autoComplete="surname"
                                                required
                                                value={formData.surname}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-2xl shadow-sm sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-2xl shadow-sm sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-2xl shadow-sm sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirm-password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-2xl shadow-sm sm:text-sm ring-0 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-gray-dark hover:bg-black outline-none ring-0 transition duration-150 ease-in-out"
                                    >
                                        {loading ? "Loading..." : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {error && (
                            <div className="mx-auto w-fit mt-6 text-center bg-red-100 border border-red-400 text-red-700 px-8 py-3 rounded-2xl">
                                {error}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AdminAddUser;
