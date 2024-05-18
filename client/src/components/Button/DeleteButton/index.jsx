import React from "react";
import TrashCan from "@icons/trash-can";

function DeleteButton({ onClick, textA = "", textB = "", className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`z-10 flex ${
                textA || textB ? "gap-2" : ""
            } text-sm font-semibold bg-red-100 border border-red-400 text-red-500 p-2 rounded-2xl hover:bg-red-200 ${className}
            ${textA && "pr-4"} ${textB && "pl-4"}
            `}
        >
            <span className="hidden sm:inline">{textB}</span>
            <TrashCan size="20" color="red" />
            <span className="hidden sm:inline">{textA}</span>
        </button>
    );
}

export default DeleteButton;
