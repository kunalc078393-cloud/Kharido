import React, { useEffect } from "react";
import ReactDOM from "react-dom";

function ErrorPopup({ error, supportText, onClose }) {
    // Auto-close after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none">
            <div
                role="alert"
                className="mt-6 flex items-start gap-3 p-4 rounded-md border border-[#d74a49] bg-red-50 shadow-lg pointer-events-auto animate-fadeIn"
            >
                {/* Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-[#d74a49] mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m0 3.75h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>

                {/* Text Block */}
                <div>
                    <p className="text-[#183e4b] font-semibold">{error}</p>
                    {supportText && (
                        <p className="text-[#1b4552] text-sm mt-1">{supportText}</p>
                    )}
                </div>
            </div>
        </div>,
        document.body // ensures it overlays everything
    );
}

export default ErrorPopup;
