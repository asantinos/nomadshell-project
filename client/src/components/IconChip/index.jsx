import React from "react";

const IconChip = ({ background, className, icon, children }) => {
    return (
        <div
            className={`mt-8 w-full sm:w-fit flex justify-center items-center py-3 px-8 bg-${background} rounded-full ${className}`}
        >
            {icon}
            <p className="ml-4 font-bold">{children}</p>
        </div>
    );
};

export default IconChip;
