import React from 'react'
import ProductDetailsPage from '../pages/ProductDetailsPage';
import { Link } from 'react-router-dom';


function Card({ product }) {

    return (
  
        <div className="flex flex-col rounded-xl overflow-hidden shadow-lg bg-white border border-[#8ba0a4] hover:shadow-2xl transition">
            {/* Product Image */}
            <div className="w-full h-56 bg-white flex items-center justify-center">
                <img
                    src={product.images[0]}
                    alt="Product"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Product Content */}
            <div className="flex flex-col flex-grow p-6">
                <h2 className="text-xl font-bold text-[#183e4b] mb-2">
                    {product.name}
                </h2>
                <p className="text-2xl font-extrabold text-[#d74a49] mb-4">
                    ₹{product.price}
                </p>
                <p className="text-[#1b4552] text-sm italic mb-4">
                    Limited time offer — grab it now!
                </p>

                {/* Spacer pushes button to bottom */}
                <div className="flex-grow"></div>

                {/* Action Button */}

                <Link to={`/products/${product._id}`}>
                    <button className="w-full px-4 py-2 rounded-lg bg-[#d74a49] text-white font-semibold hover:bg-[#1b4552] transition">
                        View Details
                    </button>


                </Link>
            </div>
        </div>


    )
}

export default Card;