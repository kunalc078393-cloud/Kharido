import React, { useEffect } from "react";

function ErrorMessage({ error, supportText, onClose, duration }) {
  // Auto-close if duration is provided
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className="flex items-start gap-3 p-4 mb-4 rounded-md border border-[#d74a49] bg-red-50 shadow-sm"
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

      {/* Manual Close Button */}
      <button
        onClick={onClose}
        className="ml-auto text-sm text-[#d74a49] hover:text-[#1b4552]"
      >
        ✕
      </button>
    </div>
  );
}

export default ErrorMessage;
