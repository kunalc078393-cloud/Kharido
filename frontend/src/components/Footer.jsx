import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (

        <footer className="bg-[#183e4b] text-white py-10 mt-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Branding */}
                <div>
                    <h1 className="text-2xl font-bold mb-4">Kharido</h1>
                    <p className="text-sm">
                        Your one-stop shop for everything you love.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Navigation</h2>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-[#d74a49] transition">Home</Link></li>
                        <li><Link to="/product" className="hover:text-[#d74a49] transition">Shop</Link></li>
                        <li><Link to="/" className="hover:text-[#d74a49] transition">About</Link></li>
                        <li><Link to="/" className="hover:text-[#d74a49] transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-[#d74a49] transition">Facebook</a>
                        <a href="#" className="hover:text-[#d74a49] transition">Instagram</a>
                        <a href="#" className="hover:text-[#d74a49] transition">Twitter</a>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Contact</h2>
                    <p className="text-sm">📍 Pune, India</p>
                    <p className="text-sm">📧 contact@kharido.com</p>
                    <p className="text-sm">📞 +91 98765 43210</p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm">
                &copy; {new Date().getFullYear()} Kharido. All rights reserved. |
                <Link to="/privacy" className="hover:text-[#d74a49] transition ml-2">Privacy Policy</Link> |
                <Link to="/terms" className="hover:text-[#d74a49] transition ml-2">Terms of Service</Link>
            </div>
        </footer>


    )
}

export default Footer