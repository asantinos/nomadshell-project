import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} from "@redux/user/userSlice";
import { Link } from "react-router-dom";
import axios from "axios";

import Footer from "@components/Footer";

function Settings() {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: currentUser.user.name,
        surname: currentUser.user.surname,
        email: currentUser.user.email,
        password: currentUser.user.password,
    });
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    // firebase storage
    // allow read;
    // allow write: if
    // request.resource.size < 2 * 1024 * 1024 &&
    // request.resource.contentType.matches('image/.*')

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            async () => {
                const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                setFormData({ ...formData, avatar: downloadURL });
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        const formFields = Object.values(formData);
        const nonEmptyFields = formFields.filter(
            (field) => field !== formData.password
        );
        const isNonEmpty = nonEmptyFields.every((field) => field.trim() !== "");
        if (!isNonEmpty) {
            dispatch(updateUserFailure("Please fill in all fields"));
            setTimeout(() => {
                dispatch(updateUserFailure(""));
            }, 3000);
            return;
        }

        try {
            dispatch(updateUserStart());

            const res = await axios.put(
                `/api/users/update/${currentUser.user._id}`,
                formData
            );

            dispatch(updateUserSuccess(res.data));

            setUpdateSuccess(true);

            setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
        } catch (error) {
            if (error.response) {
                dispatch(updateUserFailure(error.response.data.message));
            } else {
                dispatch(updateUserFailure(error.message));
            }
        }
    };

    const handleDeleteUser = async () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteConfirmation === "delete") {
            try {
                dispatch(deleteUserStart());

                const res = await axios.delete(
                    `/api/users/delete/${currentUser.user._id}`
                );

                dispatch(deleteUserSuccess(res.data));

                // Close modal after successful deletion
                setIsDeleteModalOpen(false);
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
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">Settings</h3>
                            <p className="text-lg mt-4">
                                Manage your account settings
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8">
                            <div className="flex items-center justify-between gap-8 py-5">
                                <label htmlFor="avatar">Avatar</label>
                                <div className="relative">
                                    <input
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                        }}
                                        id="avatar"
                                        type="file"
                                        ref={fileRef}
                                        hidden
                                        accept="image/*"
                                    />
                                    <img
                                        onClick={() => fileRef.current.click()}
                                        src={
                                            formData.avatar ||
                                            currentUser.user.avatar
                                        }
                                        alt={`${currentUser.user.name} ${currentUser.user.surname} avatar`}
                                        className="rounded-xl h-10 w-10 object-cover cursor-pointer"
                                    />
                                    <p
                                        className="absolute right-14 top-[50%] transform -translate-y-1/2
                                     text-nowrap text-sm"
                                    >
                                        {fileUploadError ? (
                                            <span className="text-red-700">
                                                Error Image upload (image must
                                                be less than 2 mb)
                                            </span>
                                        ) : filePerc > 0 && filePerc < 100 ? (
                                            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                                        ) : filePerc === 100 ? (
                                            <span className="text-green-700">
                                                Image successfully uploaded!
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-8 border-t py-5">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    defaultValue={currentUser.user.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="border-none outline-none flex-1 text-right text-gray-700"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-8 border-t py-5">
                                <label htmlFor="surname">Surname</label>
                                <input
                                    type="text"
                                    id="surname"
                                    defaultValue={currentUser.user.surname}
                                    onChange={handleChange}
                                    placeholder="Surname"
                                    className="border-none outline-none flex-1 text-right text-gray-700"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-8 border-t py-5">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    defaultValue={currentUser.user.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="border-none outline-none flex-1 text-right text-gray-700"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-8 border-t py-5">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="border-none outline-none flex-1 text-right text-gray-700"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-8 border-t py-5">
                                <label htmlFor="plan">Plan</label>
                                <div className="flex items-center gap-4 text-right border border-gray-300 rounded-2xl px-4 py-2 hover:border-black hover:bg-black hover:text-white transition duration-200 ease-in-out">
                                    <Link to="/pricing">Change Plan</Link>
                                    <span className="h-full text-center font-semibold">
                                        {currentUser.user.planType
                                            .charAt(0)
                                            .toUpperCase() +
                                            currentUser.user.planType.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    disabled={loading}
                                    className="mt-3 bg-gray-dark text-white px-6 py-3 rounded-2xl transition duration-200 ease-in-out hover:bg-black"
                                >
                                    {loading ? "Loading..." : "Update"}
                                </button>
                            </div>
                        </form>

                        <div className="flex mt-10">
                            <button
                                onClick={handleDeleteUser}
                                className="flex-1 bg-red-500 text-white px-6 py-2 rounded-2xl transition duration-200 ease-in-out hover:bg-red-600 hover:text-white border border-red-500"
                            >
                                Delete Account
                            </button>
                        </div>

                        {updateSuccess && (
                            <div className="mx-auto w-fit mt-6 text-center bg-green-100 border border-green-400 text-green-700 px-8 py-3 rounded-2xl">
                                User updated successfully
                            </div>
                        )}

                        {error && (
                            <div className="mx-auto w-fit mt-6 text-center bg-red-100 border border-red-400 text-red-700 px-8 py-3 rounded-2xl">
                                {error}
                            </div>
                        )}

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
                                                setIsDeleteModalOpen(false)
                                            }
                                            onMouseDown={() =>
                                                setDeleteConfirmation("")
                                            }
                                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            disabled={
                                                deleteConfirmation !== "delete"
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
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Settings;
