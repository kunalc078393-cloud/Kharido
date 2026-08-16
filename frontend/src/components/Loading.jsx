import React from 'react'

function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#eaeaea]">
            {/* Animated Spinner */}
            <div className="w-16 h-16 border-4 border-[#8ba0a4] border-t-[#d74a49] rounded-full animate-spin"></div>

            {/* Loading Text */}
            <h2 className="mt-6 text-2xl font-bold text-[#183e4b] animate-pulse">
                Loading your experience...
            </h2>

            {/* Creative Subtext */}
            <p className="mt-2 text-[#1b4552] text-sm">
                Please wait while we set things up ✨
            </p>
        </div>

    )
}

export default Loading;