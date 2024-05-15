import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
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
                navigate("/sign-in");
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
        <main className="h-content pt-header">
            <div className="h-full flex items-center justify-center max-w-7xl mx-auto p-6 py-0 sm:py-3">
                <section className="w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="text-4xl font-bold text-center">
                                Sign Up
                            </h1>
                            <p className="text-center text-gray-500 text-sm mt-4">
                                Welcome! Sign up to create an account and start
                                traveling
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
                                        {loading ? "Loading..." : "Sign Up"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-8 flex items-center justify-center">
                            <p className="text-gray-light text-sm">
                                Already have an account?{" "}
                                <a
                                    href="/sign-in"
                                    className="font-medium text-gray-light hover:text-black transition duration-150 ease-in-out"
                                >
                                    Sign In
                                </a>
                            </p>
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

export default SignUp;
