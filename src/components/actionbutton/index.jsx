import React from "react";

const COLOR_CLASSES = {
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    brand: "bg-brand-500 hover:bg-brand-600",
    gray: "bg-gray-500 hover:bg-gray-600",
    navy: "bg-navy-500 hover:bg-navy-600",
};

const ActionButton = ({onClick, label,color,icon}) => {
    const colorClass = COLOR_CLASSES[color] || COLOR_CLASSES.gray;

    return (
        <button
            className={`flex cursor-pointer items-center justify-center rounded-lg  p-2 text-white ${colorClass}`}
            onClick={onClick}
            aria-label={label}
        >
            {icon}
        </button>
    );
}
export default ActionButton;