import React, { useState, useEffect } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import tt from "@tomtom-international/web-sdk-maps";

import Footer from "@/components/Footer";
import DeleteButton from "@/components/Button/DeleteButton";

import Car from "@icons/car";

function AdminEditHome() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { id } = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        sqrt: "",
        bedrooms: "",
        bathrooms: "",
        parking: false,
        type: "Apartment",
        location: [],
        images: [],
        owner: "",
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users/all");
                setUsers(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const response = await axios.get(`/api/homes/${id}`);
                const home = response.data;

                setFormData({
                    title: home.title,
                    description: home.description,
                    price: home.price,
                    sqrt: home.sqrt,
                    bedrooms: home.bedrooms,
                    bathrooms: home.bathrooms,
                    parking: home.parking,
                    type: home.type,
                    location: home.location,
                    images: home.images,
                    owner: home.owner._id,
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchHome();
    }, [id]);

    // Map
    const style =
        "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAdFY0bHJTN3NuSldHRzl2MDs0ZGZiMzMyNS03ZWQzLTQwNDQtYTJjYy1mN2ExMzA2YzkxYTk=.json?key=12H8RLS5QqzHkfEvdABGQONbqg2Hd5l2";

    useEffect(() => {
        const map = tt.map({
            key: import.meta.env.VITE_TOMTOM_API_KEY,
            container: "map-container",
            style: style,
            center: formData.location.length > 0 ? formData.location : [0, 0],
            zoom: 12,
        });

        map.addControl(new tt.NavigationControl());
        map.addControl(new tt.FullscreenControl());
        map.addControl(new tt.GeolocateControl());

        let marker;

        if (formData.location.length > 0) {
            marker = new tt.Marker().setLngLat(formData.location).addTo(map);
        }

        map.on("click", (e) => {
            if (marker) {
                marker.remove();
            }

            marker = new tt.Marker()
                .setLngLat([e.lngLat.lng, e.lngLat.lat])
                .addTo(map);

            setFormData({
                ...formData,
                location: [e.lngLat.lng, e.lngLat.lat],
            });
        });
    }, [formData.location]);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.images.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        images: formData.images.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError(
                        "Image upload failed (2 mb max per image)"
                    );
                    setUploading(false);
                });
        } else if (files.length < 1) {
            setImageUploadError("Please select an image");
            setUploading(false);
        } else {
            setImageUploadError("You can only upload 6 images per home");
            setUploading(false);

            setTimeout(() => {
                setImageUploadError(false);
            }, 3000);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            resolve(downloadURL);
                        }
                    );
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === "parking") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === "number" ||
            e.target.type === "text" ||
            e.target.type === "textarea"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

        if (e.target.id === "type") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

        if (e.target.id === "owner") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.images.length < 3) {
            setError("Please upload at least 3 images");
            return;
        }

        if (formData.location.length < 1) {
            setError("Please select a location on the map");
            return;
        }

        try {
            setLoading(true);
            setError(false);
            const response = await axios.put(`/api/homes/update/${id}`, {
                ...formData,
            });

            if (response.status === 200) {
                setLoading(false);
                navigate("/dashboard/homes");
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong, please try again later");
            }
        }
    };

    return (
        <>
            <main className="h-auto pt-header">
                <section>
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h3 className="text-4xl font-bold">Edit home</h3>
                            <p className="text-lg mt-4">
                                Update your home details
                            </p>
                        </div>

                        <div
                            className={`grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8`}
                        >
                            {formData.images.length > 0 &&
                                formData.images.map((url, index) => (
                                    <div
                                        key={url}
                                        className="relative flex justify-between items-center border rounded-3xl max-h-60 overflow-hidden"
                                    >
                                        <img
                                            src={url}
                                            alt="home image"
                                            className="object-cover object-center w-full h-full"
                                        />
                                        <DeleteButton
                                            onClick={() =>
                                                handleRemoveImage(index)
                                            }
                                            className="absolute top-2 right-2"
                                        />
                                    </div>
                                ))}
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-10"
                        >
                            <div className="flex flex-col gap-4 flex-1">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="border p-3 rounded-2xl"
                                    id="title"
                                    maxLength="62"
                                    minLength="10"
                                    required
                                    onChange={handleChange}
                                    value={formData.title}
                                />
                                <textarea
                                    type="text"
                                    placeholder="Description"
                                    className="border p-3 rounded-2xl resize-none"
                                    id="description"
                                    required
                                    onChange={handleChange}
                                    value={formData.description}
                                />
                                <div
                                    id="map-container"
                                    className="relative w-full aspect-square rounded-2xl"
                                >
                                    <h1 className="absolute z-10 px-4 py-2 m-3 bg-white rounded-2xl text-sm font-semibold">
                                        Select where your home is located
                                    </h1>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-4">
                                <select
                                    id="owner"
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-2xl"
                                    value={formData.owner}
                                >
                                    <option key="default" value="">
                                        Select an owner
                                    </option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} {user.surname}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex gap-6 flex-wrap">
                                    <div className="flex gap-2">
                                        <label
                                            htmlFor="parking"
                                            className={`cursor-pointer flex items-center justify-center gap-2 border rounded-2xl py-2 px-6 ${
                                                formData.parking
                                                    ? "bg-black text-white hover:bg-neutral-800"
                                                    : "hover:bg-neutral-100"
                                            } `}
                                        >
                                            <Car size={24} />
                                            Parking
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="parking"
                                            className="hidden"
                                            onChange={handleChange}
                                            checked={formData.parking}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            id="sqrt"
                                            min="1"
                                            max="10000"
                                            required
                                            className="p-3 border border-gray-300 rounded-2xl"
                                            onChange={handleChange}
                                            value={formData.sqrt}
                                        />
                                        <p>Square Feet</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            id="type"
                                            className="p-3 border border-gray-300 rounded-2xl"
                                            onChange={handleChange}
                                            value={formData.type}
                                        >
                                            <option value="Apartment">
                                                Apartment
                                            </option>
                                            <option value="Farmhouse">
                                                Farmhouse
                                            </option>
                                            <option value="Bungalow">
                                                Bungalow
                                            </option>
                                            <option value="Cottage">
                                                Cottage
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            id="bedrooms"
                                            min="1"
                                            max="15"
                                            required
                                            className="p-3 border border-gray-300 rounded-2xl"
                                            onChange={handleChange}
                                            value={formData.bedrooms}
                                        />
                                        <p>Bedrooms</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            id="bathrooms"
                                            min="1"
                                            max="15"
                                            required
                                            className="p-3 border border-gray-300 rounded-2xl"
                                            onChange={handleChange}
                                            value={formData.bathrooms}
                                        />
                                        <p>Bathrooms</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            id="price"
                                            min="50"
                                            max="50000"
                                            required
                                            className="p-3 border border-gray-300 rounded-2xl"
                                            onChange={handleChange}
                                            value={formData.price}
                                        />
                                        <div className="flex flex-col items-center">
                                            <p>NomadPoints / night</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-semibold">
                                    Images:
                                    <span className="font-normal text-gray-600 ml-2">
                                        The first image will be the cover (max
                                        6)
                                    </span>
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2 flex-1 text-center">
                                        <input
                                            onChange={(e) =>
                                                setFiles(e.target.files)
                                            }
                                            type="file"
                                            id="images"
                                            accept="image/*"
                                            name="images"
                                            multiple
                                            hidden
                                        />
                                        <label
                                            htmlFor="images"
                                            className="p-3 text-center bg-neutral-800 text-white rounded-2xl uppercase hover:bg-black cursor-pointer"
                                        >
                                            Select Images
                                        </label>
                                        <button
                                            type="button"
                                            disabled={uploading}
                                            onClick={handleImageSubmit}
                                            className="p-3 border border-black font-semibold rounded-2xl uppercase hover:bg-black hover:text-white disabled:opacity-80 transition duration-200 ease-in-out"
                                        >
                                            {uploading
                                                ? "Uploading..."
                                                : "Upload"}
                                        </button>
                                        <p className="text-gray-600">
                                            {files.length} images selected
                                        </p>
                                    </div>
                                </div>
                                {imageUploadError && (
                                    <p className="text-center bg-red-100 border border-red-400 text-red-700 px-8 py-3 rounded-2xl">
                                        {imageUploadError && imageUploadError}
                                    </p>
                                )}
                                <button
                                    disabled={loading || uploading}
                                    className="p-3 bg-neutral-800 text-white rounded-2xl uppercase hover:bg-black disabled:opacity-80"
                                >
                                    {loading ? "Editing..." : "Edit Home"}
                                </button>
                                {error && (
                                    <p className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-2xl">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default AdminEditHome;