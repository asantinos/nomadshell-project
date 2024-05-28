import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

import HomeCard from "@components/Homes/HomeCard";
import Search from "@icons/search";
import Loader from "@components/Loader";
import Footer from "@components/Footer";

import Car from "@icons/car";

function Homes() {
    const [isLoading, setIsLoading] = useState(true);
    const [homes, setHomes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([]);
    const [selectedType, setSelectedType] = useState("all");
    const [parking, setParking] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchHomes = async (filters = {}) => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/homes/all", {
                params: { ...filters, page, limit: 6 },
            });
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setHomes((prevHomes) => [...prevHomes, ...response.data]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchHomes();
    }, []);

    const handleFilterChange = () => {
        setPage(1);
        setHasMore(true);
        setHomes([]);
        
        fetchHomes({
            searchTerm: searchQuery,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            type: selectedType,
            parking,
            page: 1,
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
                        <form className="flex flex-col w-full gap-2 justify-between">
                            <h3 className="text-xl font-bold">Filters</h3>

                            <div className="flex justify-between">
                                <div className="flex lg:items-center flex-col lg:flex-row gap-4 mt-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium">
                                            Nomadpoints:
                                        </label>
                                        <div className="w-full grid grid-cols-2 gap-2">
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
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium">
                                            Type:
                                        </label>
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
                                            <option value="Cottage">
                                                Cottage
                                            </option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium">
                                            Features:
                                        </label>
                                        <label
                                            htmlFor="parking"
                                            className={`cursor-pointer flex items-center justify-center gap-2 border rounded-2xl py-2 px-6 ${
                                                parking
                                                    ? "bg-black text-white hover:bg-neutral-800"
                                                    : "hover:bg-neutral-100"
                                            } `}
                                        >
                                            <Car size={24} />
                                            Parking
                                        </label>
                                        <input
                                            name="parking"
                                            id="parking"
                                            type="checkbox"
                                            checked={parking}
                                            onChange={() =>
                                                setParking(!parking)
                                            }
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleFilterChange}
                                className="w-full sm:w-44 bg-neutral-800 text-white rounded-2xl py-3 px-6 hover:bg-black mt-2"
                            >
                                Apply Filters
                            </button>
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                                <h3 className="text-3xl font-bold py-4 mt-4">
                                    <span id="homes-total-results">
                                        {searchQuery === "" &&
                                        priceRange.length === 0 &&
                                        selectedType === "all" &&
                                        parking === false
                                            ? homes.length
                                            : filteredHomes.length}
                                    </span>{" "}
                                    Results
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search by title, location or type"
                                        className="w-full sm:w-80 border rounded-2xl p-2 pl-10 placeholder:text-sm"
                                    />
                                    <Search
                                        size={20}
                                        color="gray"
                                        className="absolute top-3 left-3"
                                    />
                                </div>
                            </div>

                            <InfiniteScroll
                                dataLength={filteredHomes.length}
                                next={fetchHomes}
                                hasMore={hasMore}
                                loader={<Loader />}
                                endMessage={
                                    <p className="text-center mt-8 text-gray-400">
                                        No more homes to show
                                    </p>
                                }
                                scrollThreshold={0.7} // Load more if 70% of the page has been scrolled
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 mt-4">
                                    {filteredHomes.map((home) => (
                                        <HomeCard key={home._id} home={home} />
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}

export default Homes;
