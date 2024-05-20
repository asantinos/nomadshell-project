import React from "react";
import Pencil from "@icons/pencil";

function EditButton({ onClick, textA = "", textB = "", className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`z-10 flex ${
                textA || textB ? "gap-2" : ""
            } text-sm font-semibold bg-blue-100 border border-blue-400 text-blue-500 p-2 rounded-2xl hover:bg-blue-200 ${className}
            ${textA && "sm:pr-4"} ${textB && "sm:pl-4"}
            `}
        >
            <span className="hidden sm:inline">{textB}</span>
            <Pencil size="20" color="blue" />
            <span className="hidden sm:inline">{textA}</span>
        </button>
    );
}

export default EditButton;
