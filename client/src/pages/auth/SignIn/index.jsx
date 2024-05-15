import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "@redux/user/userSlice";
import axios from "axios";
import OAuth from "@components/OAuth";

function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { loading, error } = useSelector((state) => state.user);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(signInStart());

            const res = await axios.post("/api/auth/sign-in", formData);

            dispatch(signInSuccess(res.data));
            navigate("/");
        } catch (error) {
            if (error.response) {
                dispatch(signInFailure(error.response.data.message));

                setTimeout(() => {
                    dispatch(signInFailure(""));
                }, 5000);
            } else {
                dispatch(signInFailure(error.message));
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
                                Sign In
                            </h1>
                            <p className="text-center text-gray-500 text-sm mt-4">
                                Welcome back! Sign in to your account to start
                                traveling
                            </p>
                        </div>

                        <div className="mt-8 w-full">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 max-w-md mx-auto"
                            >
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
                                            // autoComplete="current-password"
                                            required
                                            onChange={handleChange}
                                            className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-2xl shadow-sm sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            // onChange={handleRememberMe}
                                            className="h-4 w-4 focus:ring-gray-dark border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="remember-me"
                                            className="ml-2 block text-sm text-gray-900"
                                        >
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a
                                            href="#"
                                            className="font-medium text-gray-light hover:text-gray-dark transition duration-150 ease-in-out"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div> */}

                                <div>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-gray-dark hover:bg-black ring-0 outline-none transition duration-150 ease-in-out
                                        disabled:opacity-50 disabled:"
                                    >
                                        {loading ? "Loading..." : "Sign In"}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 max-w-md mx-auto">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 max-w-md mx-auto">
                                <OAuth />
                            </div>

                            <div className="mt-6 text-sm text-center">
                                <p className="text-gray-500">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/sign-up"
                                        className="font-medium text-gray-light hover:text-gray-dark transition duration-150 ease-in-out"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>

                            {error && (
                                <div className="mx-auto w-fit mt-6 text-center bg-red-100 border border-red-400 text-red-700 px-8 py-3 rounded-2xl">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default SignIn;
