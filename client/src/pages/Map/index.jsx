import React, { useState, useEffect } from "react";
import axios from "axios";
import tt from "@tomtom-international/web-sdk-maps";
import TomTomMap from "@components/Map/TomTomMap";
import MapButton from "@components/Map/MapButton";

import Search from "@icons/search";
import Cross from "@icons/cross";
import Check from "@icons/check";
import Plus from "@icons/plus";
import Minus from "@icons/minus";
import CheckIn from "@icons/check-in";
import Square from "@icons/square";
// import Pin from "@icons/pin";

// TODO: CHECK MAP DUPLICATED IN PAGE AND COMPONENT

function Map() {
    // TODO : Import homes from database
    // Homes with coordinates example
    const [homes, setHomes] = useState([
        {
            id: 1,
            title: "Home 1",
            coordinates: [55.284934807074684, 25.216284970808157],
        },
        {
            id: 2,
            title: "Home 2",
            coordinates: [-5.673403888764439, 43.52450675476761],
        },
    ]);

    // TomTom API Map
    const APIKEY = "12H8RLS5QqzHkfEvdABGQONbqg2Hd5l2";
    const GIJON = [-5.673403888764439, 43.52450675476761];
    const DUBAI = [55.284934807074684, 25.216284970808157];
    const style =
        "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAdFY0bHJTN3NuSldHRzl2MDs0ZGZiMzMyNS03ZWQzLTQwNDQtYTJjYy1mN2ExMzA2YzkxYTk=.json?key=12H8RLS5QqzHkfEvdABGQONbqg2Hd5l2";
    const style2 =
        "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAdFY0bHJTN3NuSldHRzl2MDs0ZTVhMDc1ZC1mZTgzLTQ5YTUtOGE0Yy1hMzFhMWRhN2U0ZDE=/drafts/0.json?key=12H8RLS5QqzHkfEvdABGQONbqg2Hd5l2";

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [map, setMap] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [actualLocation, setActualLocation] = useState(null);
    const [currentStyle, setCurrentStyle] = useState(style);

    // Get users actual location
    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0,
                    });
                });
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setActualLocation([
                    position.coords.longitude,
                    position.coords.latitude,
                ]);
            } catch (error) {
                console.error("Error getting user location:", error);
            }
        };
        fetchUserLocation();
    }, []);

    // Load map
    useEffect(() => {
        const language =
            window.navigator.userLanguage || window.navigator.language;
        const lang = language.split("-")[0];

        if (latitude !== null && longitude !== null) {
            const newMap = tt.map({
                key: APIKEY,
                container: "map-container",
                center: [longitude, latitude],
                zoom: 12,
                style: currentStyle,
                dragRotate: false,
                touchPitch: false,
                language: lang,
                maxZoom: 16,
                minZoom: 4.5,
                scrollZoom: true,
            });

            setMap(newMap);

            return () => {
                newMap.remove();
            };
        } else {
            const newMap = tt.map({
                key: APIKEY,
                container: "map-container",
                center: DUBAI,
                zoom: 12,
                style: currentStyle,
                dragRotate: false,
                touchPitch: false,
                language: lang,
                maxZoom: 16,
                minZoom: 4.5,
                scrollZoom: true,
            });

            setMap(newMap);

            return () => {
                newMap.remove();
            };
        }
    }, [latitude, longitude]);

    // Change Map Style
    const changeMapStyle = () => {
        const newStyle = currentStyle === style ? style2 : style;
        if (map) {
            map.setStyle(newStyle);
        }
        setCurrentStyle(newStyle);
    };

    // Show actual location with reverse geocoding
    useEffect(() => {
        if (latitude !== null && longitude !== null) {
            const reverseGeocode = async () => {
                try {
                    const response = await fetch(
                        `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${APIKEY}`
                    );
                    const data = await response.json();
                    const address = data.addresses[0].address;
                    const city = address.municipality;
                    const country = address.country;
                    const actualLocationElement =
                        document.getElementById("actual-location");
                    if (actualLocationElement) {
                        actualLocationElement.textContent = city
                            ? `${city}, ${country}`
                            : `${country}`;
                    }
                } catch (error) {
                    console.error("Error getting user location:", error);
                }
            };

            reverseGeocode();
        }
    }, [latitude, longitude]);

    // Search for a location
    const goToLocation = async () => {
        try {
            // Check if searchQuery is empty
            if (!searchQuery.trim()) {
                console.log("Search query is empty.");
                return;
            }

            const response = await fetch(
                `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
                    searchQuery
                )}.json?key=${APIKEY}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { position } = data.results[0];
                if (map) {
                    const zoomLevel = data.results[0].address.municipality
                        ? 12
                        : 5;
                    map.flyTo({
                        center: [position.lon, position.lat],
                        essential: true,
                        zoom: zoomLevel,
                        duration: 1000,
                    });
                    setActualLocation([position.lon, position.lat]);
                }

                // Close search input and clear search query
                toggleSearchInput();
                clearSearchQuery();
                const searchInput = document.getElementById("map-search-input");
                searchInput.blur();

                // Update actual location
                const actualLocationElement =
                    document.getElementById("actual-location");
                let city = data.results[0].address.municipality;
                let country = data.results[0].address.country;

                if (actualLocationElement) {
                    if (!city) {
                        actualLocationElement.textContent = `${country}`;
                    } else {
                        actualLocationElement.textContent = `${city}, ${country}`;
                    }
                }
            } else {
                console.log("Location not found");
            }
        } catch (error) {
            console.error("Error searching location:", error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            goToLocation();
        }
    };

    // Show/Hide search input
    const toggleSearchInput = () => {
        const searchContainter = document.getElementById(
            "map-search-container"
        );
        const searchInputContainer = document.getElementById(
            "map-search-input-container"
        );
        const searchShowButton = document.getElementById(
            "map-search-show-button"
        );
        const mapHomeType = document.getElementById("map-home-type");

        searchInputContainer.classList.toggle("hidden");
        searchInputContainer.classList.toggle("flex");
        searchShowButton.classList.toggle("rounded-r-none");
        searchContainter.classList.toggle("w-full");
        searchContainter.classList.toggle("sm:w-fit");

        // Focus on search input
        const searchInput = document.getElementById("map-search-input");
        searchInput.focus();
    };

    // Handle search query change
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Clear search input
    const clearSearchQuery = () => {
        setSearchQuery("");
        const searchInput = document.getElementById("map-search-input");
        searchInput.value = "";
        searchInput.focus();
    };

    // Move map to users location
    const goToUsersLocation = async () => {
        if (map && latitude !== null && longitude !== null) {
            map.flyTo({
                center: [longitude, latitude],
                essential: true,
                zoom: 12,
                duration: 1000,
            });

            setActualLocation([longitude, latitude]);

            // Update actual location to users location
            try {
                const response = await fetch(
                    `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${APIKEY}`
                );
                const data = await response.json();
                const address = data.addresses[0].address;
                const city = address.municipality;
                const country = address.country;
                const actualLocationElement =
                    document.getElementById("actual-location");
                if (actualLocationElement) {
                    if (city) {
                        actualLocationElement.textContent = `${city}, ${country}`;
                    } else {
                        actualLocationElement.textContent = `${country}`;
                    }
                }
            } catch (error) {
                console.error("Error getting user location:", error);
            }
        }
    };

    // Go to actual location
    const goToActualLocation = () => {
        if (actualLocation) {
            const zoomLevel = actualLocationHasCity() ? 12 : 5;
            map.flyTo({
                center: actualLocation,
                essential: true,
                zoom: zoomLevel,
                duration: 1000,
            });
        }
    };

    // Check if actual location has a city
    const actualLocationHasCity = () => {
        if (actualLocation) {
            return document
                .getElementById("actual-location")
                .textContent.includes(",");
        }
        return false;
    };

    // Zoom in
    const zoomIn = () => {
        if (map) {
            const currentZoom = map.getZoom();
            map.easeTo({
                zoom: currentZoom + 1,
                duration: 500,
            });
        }
    };

    // Zoom out
    const zoomOut = () => {
        if (map) {
            const currentZoom = map.getZoom();
            map.easeTo({
                zoom: currentZoom - 1,
                duration: 500,
            });
        }
    };

    // Add markers for homes onto the map
    useEffect(() => {
        if (map) {
            homes.forEach((home) => {
                const marker = new tt.Marker({
                    anchor: "bottom",
                })
                    .setLngLat(home.coordinates)
                    .addTo(map);

                const popupHTML = `
                <div class="bg-white p-4">
                    <div class="font-bold text-xl">${home.title}</div>
                    <div class="text-gray-600">${home.description}</div>
                </div>
            `;

                const popup = new tt.Popup({
                    offset: 30,
                    closeButton: false,
                }).setHTML(popupHTML);

                marker.setPopup(popup);
            });
        }
    }, [map, homes]);

    return (
        <div className="relative h-content w-full overflow-hidden">
            <div className="absolute z-50">
                <div
                    id="map-top-container"
                    className="relative flex w-full top-0 left-0 p-4"
                >
                    <div
                        id="map-search-container"
                        className="flex items-center"
                    >
                        <MapButton
                            id="map-search-show-button"
                            onClick={toggleSearchInput}
                            icon={<Search color="#314939" size={24} />}
                        />
                        <div
                            id="map-search-input-container"
                            className="hidden relative items-center w-full sm:w-fit"
                        >
                            <input
                                type="text"
                                id="map-search-input"
                                placeholder="Search location..."
                                className="bg-white pl-4 pr-9 py-3 w-full sm:w-64 ring-0 outline-none rounded-none"
                                onChange={handleSearchQueryChange}
                                onKeyUp={handleKeyPress}
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-12 pr-4"
                                    onClick={clearSearchQuery}
                                    type="button"
                                >
                                    <Cross color="#314939" size={12} />
                                </button>
                            )}
                            <button
                                id="map-search-button"
                                className="bg-gray-lighter hover:bg-gray-semilight p-3 rounded-r-2xl"
                                onClick={goToLocation}
                                type="button"
                            >
                                <Check color="#314939" size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute z-50 bottom-0 left-0 p-4">
                <div
                    id="actual-location"
                    className="font-medium text-lg opacity-80 bg-white hover:bg-gray-lighter px-4 py-2 rounded-2xl shadow-md cursor-pointer transition-opacity duration-300"
                    onClick={goToActualLocation}
                >
                    Loading...
                </div>
            </div>

            <div className="absolute z-50 grid grid-cols-2 bottom-0 right-0 p-4 gap-2 items-center">
                <MapButton
                    id="map-change-button"
                    onClick={changeMapStyle}
                    icon={<Square color="#314939" size={24} />}
                />
                <MapButton
                    id="map-me-button"
                    onClick={goToUsersLocation}
                    icon={<CheckIn color="#314939" size={24} />}
                    disabled={latitude === null || longitude === null}
                />
                <MapButton
                    id="map-zoom-out-button"
                    onClick={zoomOut}
                    icon={<Minus color="#314939" size={24} />}
                />
                <MapButton
                    id="map-zoom-in-button"
                    onClick={zoomIn}
                    icon={<Plus color="#314939" size={24} />}
                />
            </div>

            <TomTomMap />
        </div>
    );
}

export default Map;
