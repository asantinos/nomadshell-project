import React from "react";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-content -mt-10 p-6">
            <h1 className="text-4xl font-bold text-gray-800">404</h1>
            <h2 className="text-xl font-semibold text-gray-600">
                Page not found
            </h2>
            <p className="mt-4 text-sm text-gray-600 text-center">
                Oops! The page you are looking for does not exist.
            </p>
        </div>
    );
};

export default NotFound;
