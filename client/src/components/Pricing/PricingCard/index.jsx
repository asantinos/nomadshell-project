import React from "react";

function PricingCard({
    title,
    titleAtt,
    description,
    listItems,
    price,
    isMostPopular,
}) {
    return (
        <div
            className={`${
                isMostPopular ? "relative border-black" : " border-transparent"
            } w-full flex flex-col justify-between bg-gray-lighter backdrop:opacity-50 rounded-3xl p-8 border-4`}
        >
            {isMostPopular && (
                <h2 className="absolute border-2 border-black bg-black text-white whitespace-nowrap px-6 py-1 rounded-full -top-5 left-[50%] -translate-x-[50%] font-bold">
                    Most Popular
                </h2>
            )}
            <div>
                <h3 className={`text-3xl font-bold ${titleAtt}`}>{title}</h3>
                <p className="text-base text-gray-light mt-6">{description}</p>
                <ul className="list-disc list-inside mt-8 text-left space-y-4">
                    {listItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
            <p className="text-2xl font-medium mt-4">
                {price}{" "}
                <span className="text-sm text-gray-light mt-4">/ year</span>
            </p>
            <button className="w-full bg-gray-dark hover:bg-black text-white font-medium rounded-full py-3 mt-8 transition duration-200 ease-in-out">
                Select Plan
            </button>
        </div>
    );
}

export default PricingCard;
