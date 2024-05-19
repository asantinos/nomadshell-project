import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import HomeCard from "@components/Homes/HomeCard";
import Search from "@icons/search";
import Loader from "@components/Loader";
import Footer from "@components/Footer";

function Homes() {
    const [isLoading, setIsLoading] = useState(true);
    const [homes, setHomes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedType, setSelectedType] = useState("all");
    const [parking, setParking] = useState(false);

    const fetchHomes = async (filters = {}) => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/homes/all", {
                params: filters,
            });
            setHomes(response.data);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchHomes();
    }, []);

    const handleFilterChange = () => {
        fetchHomes({
            searchTerm: searchQuery,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            type: selectedType,
            parking,
        });
    };

    const filteredHomes = useMemo(() => {
        return homes.filter(
            (home) =>
                home.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                home.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [homes, searchQuery]);

    return isLoading ? (
        <Loader />
    ) : (
        <main className="h-auto pt-header">
            <div className="max-w-7xl mx-auto p-6 py-0 sm:py-3">
                <section className="mt-6">
                    <div className="max-w-7xl mx-auto">
                        <form className="flex flex-col md:flex-row w-full gap-2 items-center justify-between">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search by title, location or type"
                                    className="border rounded-2xl p-2 pl-10 placeholder:text-sm"
                                />
                                <Search
                                    size={20}
                                    color="gray"
                                    className="absolute top-3 left-3"
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="flex items-center gap-2">
                                    <label>Price Range:</label>
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) =>
                                            setPriceRange([
                                                e.target.value,
                                                priceRange[1],
                                            ])
                                        }
                                        placeholder="Min"
                                        className="border rounded-2xl p-2"
                                    />
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) =>
                                            setPriceRange([
                                                priceRange[0],
                                                e.target.value,
                                            ])
                                        }
                                        placeholder="Max"
                                        className="border rounded-2xl p-2"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label>Type:</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) =>
                                            setSelectedType(e.target.value)
                                        }
                                        className="border rounded-2xl p-2"
                                    >
                                        <option value="all">All</option>
                                        <option value="Apartment">
                                            Apartment
                                        </option>
                                        <option value="Farmhouse">
                                            Farmhouse
                                        </option>
                                        <option value="Bungalow">
                                            Bungalow
                                        </option>
                                        <option value="Cottage">Cottage</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label>Parking:</label>
                                    <input
                                        type="checkbox"
                                        checked={parking}
                                        onChange={() => setParking(!parking)}
                                        className="border rounded-2xl p-2"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleFilterChange}
                                    className="bg-blue-500 text-white rounded-2xl p-2"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </form>
                    </div>

                    {homes.length === 0 ? (
                        <div className="h-content">
                            <p className="text-xl font-semibold mt-8">
                                No homes available at the moment
                            </p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-3xl font-bold py-4">
                                <span id="homes-total-results">
                                    {filteredHomes.length}
                                </span>{" "}
                                Results
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 mt-4">
                                {filteredHomes.map((home) => (
                                    <HomeCard key={home._id} home={home} />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}

export default Homes;
