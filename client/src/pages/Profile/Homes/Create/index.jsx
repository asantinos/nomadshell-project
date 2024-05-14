import React, { useState } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateHome() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
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
        // TODO : Add location by clicking on the map
        location: [-5.673403888764439, 43.52450675476761], // Gijon de ejemplo
        images: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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
        } else {
            setImageUploadError("You can only upload 6 images per home");
            setUploading(false);
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
                    console.log(`Upload is ${progress}% done`);
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(false);
            const response = await axios.post("/api/homes/create", {
                ...formData,
                owner: currentUser.user._id,
            });

            if (response.status === 201) {
                setLoading(false);
                navigate("/profile");
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setError("Check the form and try again");
            } else {
                setError("Something went wrong, please try again later");
            }
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Add a Home
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Title"
                        className="border p-3 rounded-lg"
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
                        className="border p-3 rounded-lg resize-none"
                        id="description"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <div className="relative h-40 w-full overflow-hidden">
                        <div className="absolute z-50">
                            <div
                                id="map-top-container"
                                className="relative flex w-full top-0 left-0 p-4"
                            >
                                <input
                                    type="text"
                                    placeholder="Search for a location"
                                    className="p-3 border border-gray-300 rounded-lg w-full"
                                    id="location"
                                    // required
                                    onChange={handleChange}
                                    value={formData.location}
                                />
                            </div>
                        </div>
                        Mapa
                    </div>

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking</span>
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
                                className="p-3 border border-gray-300 rounded-lg"
                                onChange={handleChange}
                                value={formData.sqrt}
                            />
                            <p>Square Feet</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                id="type"
                                className="p-3 border border-gray-300 rounded-lg"
                                onChange={handleChange}
                                value={formData.type}
                            >
                                <option value="Apartment">Apartment</option>
                                <option value="Farmhouse">Farmhouse</option>
                                <option value="Bungalow">Bungalow</option>
                                <option value="Cottage">Cottage</option>
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
                                className="p-3 border border-gray-300 rounded-lg"
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
                                className="p-3 border border-gray-300 rounded-lg"
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
                                className="p-3 border border-gray-300 rounded-lg"
                                onChange={handleChange}
                                value={formData.price}
                            />
                            <div className="flex flex-col items-center">
                                <p>NomadPoints / night</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">
                            The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    <p className="text-red-700 text-sm">
                        {imageUploadError && imageUploadError}
                    </p>
                    {formData.images.length > 0 &&
                        formData.images.map((url, index) => (
                            <div
                                key={url}
                                className="flex justify-between p-3 border items-center"
                            >
                                <img
                                    src={url}
                                    alt="home image"
                                    className="w-20 h-20 object-contain rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button
                        disabled={loading || uploading}
                        className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        {loading ? "Adding..." : "Add Home"}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
}

export default CreateHome;
