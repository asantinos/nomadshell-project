import React, { useState, useEffect } from "react";
import ArrowUp from "@icons/arrow-up";

function GoToTop() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowButton(scrollTop > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleGoToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="z-[900] fixed bottom-5 right-5">
            {showButton && (
                <button
                    onClick={handleGoToTop}
                    className="bg-gray-dark text-white p-3 rounded-full shadow-lg hover:bg-black transition duration-200 ease-out"
                >
                    <ArrowUp size={20} color="#fff" />
                </button>
            )}
        </div>
    );
}

export default GoToTop;
