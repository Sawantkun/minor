import React from "react";

const Modal = ({ isOpen, onClose, children, className }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${className}`} onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3">
                {React.Children.map(children, (child) =>
                    React.cloneElement(child, { onClose })
                )}
            </div>
        </div>
    );
};

const Header = ({ children, onClose, className }) => (
    <div className={`flex justify-between items-start p-8 border-b ${className}`}>
        <h2 className="text-xl font-semibold">{children}</h2>
        <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
            ✕
        </button>
    </div>
);

const Body = ({ children, className }) => (
    <div className={`p-8 ${className}`}>{children}</div>
);

const Footer = ({ children, className }) => (
    <div className={`flex justify-end items-center p-8 border-t ${className}`}>
        {children}
    </div>
);

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
