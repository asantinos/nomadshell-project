import React from "react";

const MapButton = ({ id, onClick, icon, className, disabled }) => {
    return (
        <button
            id={id}
            className={`bg-white hover:bg-gray-lighter p-3 rounded-2xl shadow-lg ${className}
            ${disabled ? "hover:bg-white opacity-30" : "cursor-pointer"}`}
            onClick={onClick}
            type="button"
            disabled={disabled}
        >
            {icon}
        </button>
    );
};

export default MapButton;
