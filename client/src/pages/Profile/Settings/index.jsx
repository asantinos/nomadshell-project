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
import axios from "axios";

function Settings() {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: currentUser.user.name,
        surname: currentUser.user.surname,
        email: currentUser.user.email,
        password: "",
    });
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

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

        try {
            dispatch(updateUserStart());

            const res = await axios.put(
                `http://localhost:3000/api/users/update/${currentUser.user._id}`,
                formData
            );

            dispatch(updateUserSuccess(res.data));
            setUpdateSuccess(true);
        } catch (error) {
            if (error.response) {
                dispatch(updateUserFailure(error.response.data.message));
            } else {
                dispatch(updateUserFailure(error.message));
            }
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/users/delete/${currentUser.user._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    return (
        <>
            <main className="h-auto">
                <section>
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">Settings</h3>
                            <p className="text-lg mt-4">
                                Manage your account settings
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8">
                            <div className="flex items-center justify-between py-3">
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
                                        className="rounded-3xl h-10 w-10 object-cover cursor-pointer"
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

                            <div className="flex items-center justify-between border-t py-3">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    defaultValue={currentUser.user.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="border-none outline-none text-right"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t py-3">
                                <label htmlFor="surname">Surname</label>
                                <input
                                    type="text"
                                    id="surname"
                                    defaultValue={currentUser.user.surname}
                                    onChange={handleChange}
                                    placeholder="Surname"
                                    className="border-none outline-none text-right"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t py-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    defaultValue={currentUser.user.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="border-none outline-none text-right"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t py-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="border-none outline-none text-right"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    disabled={loading}
                                    className="mt-8 border border-black hover:bg-black hover:text-white font-bold py-4 px-8 rounded-3xl transition duration-200 ease-in-out"
                                >
                                    {loading ? "Loading..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Settings;
