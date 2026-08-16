import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo2.png"
import Loading from './Loading';


function Navbar() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout()).unwrap();
        Navigate("/login");
    }





    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-[#183e4b] text-white shadow-md">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-wide">
                Kharido
            </Link>

            {/* Middle Section (flexible: search, nav links, etc.) */}
            <div className="flex-1 flex justify-center gap-6">
                {/* Example: Add links or search bar here */}
                <Link to="/" className="hover:text-[#d74a49]">Home</Link>
                <Link to="/products" className="hover:text-[#d74a49]">Products</Link>

            </div>

            {/* Right Section: Username + Cart */}
            <div className="flex items-center gap-6">
                {user && (
                    <span className="relative group">
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#1b4552]/80 to-[#183e4b]/80 
             text-[#eaeaea] font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
                        >
                            {/* Avatar Circle */}
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#8ba0a4] text-[#183e4b] font-bold">
                                {user.fullName.charAt(0)}
                            </div>

                            {/* User Name */}
                            <span className="tracking-wide font-semibold">
                                {user.fullName}
                            </span>
                        </Link>
                        {/* Tooltip on hover */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-[#183e4b] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                            Go to Profile
                        </span>
                    </span>
                )}
                <Link to="/cart" className="relative hover:text-[#d74a49]">
                    🛒
                    {/* Cart badge example */}
                    {isAuthenticated ? (
                        <span className="absolute -top-2 -right-3 bg-[#d74a49] text-white text-xs px-2 py-0.5 rounded-full">
                            {cart && cart.items.reduce((acc, product) => acc + product.quantity , 0)}

                        </span>
                    ) : (
                        ''
                    )}


                </Link>




                {
                    isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 rounded bg-[#d74a49] hover:bg-[#1b4552] transition"
                        >
                            Logout
                        </button>

                    ) : (
                        <div>
                            <Link
                                to="/login"
                                className="px-3 py-1 mx-1 rounded bg-[#d74a49] hover:bg-[#1b4552] transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-3 py-1 mx-1 rounded bg-[#d74a49] hover:bg-[#1b4552] transition"
                            >
                                Register
                            </Link>
                        </div>
                    )
                }

            </div>

        </nav>



    )
}

export default Navbar;