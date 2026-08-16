import React from 'react'

function NoProductFound() {
    return (
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-[#eaeaea] rounded-xl p-8">
            {/* Icon */}
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100 border-4 border-[#d74a49] mb-6 animate-bounce">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-[#d74a49]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            {/* Main Message */}
            <h2 className="text-2xl font-bold text-[#183e4b] mb-2">
                No Products Found
            </h2>

            {/* Supportive Text */}
            <p className="text-[#1b4552] text-center max-w-md mb-6">
                Looks like we couldn’t find any products right now.
                Try adjusting your filters, refreshing the page, or check back later — new items are added often!
            </p>


        </div>
    )
}

export default NoProductFound