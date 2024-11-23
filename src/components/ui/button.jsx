import React from "react";
import clsx from "clsx";

const Button = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    className = "",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx("p-4 bg-purple text-white font-semibold rounded-lg shadow-md hover:bg-purple focus:outline-none focus:ring-2 focus:ring-purple focus:ring-opacity-75 disabled:bg-gray-300 disabled:cursor-not-allowed", className)}
        >
            {children}
        </button>
    );
};

export default Button;
