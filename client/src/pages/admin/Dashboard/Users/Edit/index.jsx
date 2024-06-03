import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AdminEditUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        surname: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/api/users/get/${id}`);
                const user = res.data;

                setFormData({
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    password: "",
                });
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message);
                } else {
                    setError(error.message);
                }
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const updatedUser = { ...formData };
            if (updatedUser.password === "") {
                delete updatedUser.password;
            }

            const res = await axios.put(`/api/users/update/${id}`, updatedUser);

            if (res.status === 200) {
                navigate("/dashboard/users");
            }
        } catch (error) {
            setLoading(false);
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
                            <h3 className="text-4xl font-bold">Edit user</h3>
                            <p className="text-lg mt-4">
                                Update user information
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
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-2xl shadow-sm sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-gray-dark hover:bg-black outline-none ring-0 transition duration-150 ease-in-out"
                                    >
                                        {loading ? "Loading..." : "Update user"}
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

export default AdminEditUser;
