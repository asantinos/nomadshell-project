import React from "react";
import Plus from "@icons/plus";

function AddButton({ onClick, textA = "", textB = "", className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`z-10 flex ${
                textA || textB ? "gap-2" : ""
            } text-sm font-semibold bg-black border border-black text-white p-2 rounded-2xl hover:bg-gray-dark hover:text-white transition duration-100 ease-in-out ${className}
            ${textA && "sm:pr-4"} ${textB && "sm:pl-4"}
            `}
        >
            <span className="hidden sm:inline">{textB}</span>
            <Plus size="20" color="currentColor" />
            <span className="hidden sm:inline">{textA}</span>
        </button>
    );
}

export default AddButton;
