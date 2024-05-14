import React from "react";

const Button = ({ className, onClick, children }) => {
    return (
        <button
            className={`border py-4 px-8 rounded-3xl transition duration-200 ease-in-out ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
