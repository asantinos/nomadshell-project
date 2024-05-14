import React, { useState, useEffect } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./index.css";

const TomTomMap = ({ children }) => {
    // Homes with coordinates example
    const [homes, setHomes] = useState([
        { id: 1, coordinates: [55.284934807074684, 25.216284970808157] },
        { id: 2, coordinates: [-5.673403888764439, 43.52450675476761] },
    ]);

    // TomTom API Map
    const APIKEY = "12H8RLS5QqzHkfEvdABGQONbqg2Hd5l2";
    const DUBAI = [55.284934807074684, 25.216284970808157];
    const style =
        "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAdFY0bHJTN3NuSldHRzl2MDs0ZGZiMzMyNS03ZWQzLTQwNDQtYTJjYy1mN2ExMzA2YzkxYTk=.json?key=12H8RLS5QqzHkfEvdABGQONbqg2Hd5l2";
    const style2 =
        "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAdFY0bHJTN3NuSldHRzl2MDs0ZTVhMDc1ZC1mZTgzLTQ5YTUtOGE0Yy1hMzFhMWRhN2U0ZDE=/drafts/0.json?key=12H8RLS5QqzHkfEvdABGQONbqg2Hd5l2";

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [map, setMap] = useState(null);
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

    // Add markers for homes onto the map
    useEffect(() => {
        if (map) {
            homes.forEach((home) => {
                const marker = new tt.Marker({
                    anchor: "bottom",
                })
                    .setLngLat(home.coordinates)
                    .addTo(map);

                // Add a click event listener to each marker
                marker.getElement().addEventListener("click", () => {
                    // Create a popup with the id, longitude, and latitude
                    const popup = new tt.Popup({
                        offset: [0, -30], // Offset the popup so it's above the marker
                    });

                    // Open the popup at the marker's coordinates
                    popup
                        .setLngLat(home.coordinates)
                        .setText("PopUp")
                        .addTo(map);
                });
            });
        }
    }, [map, homes]);

    return (
        <div id="map-container" className="h-full w-full relative">
            {children}
        </div>
    );
};

export default TomTomMap;
