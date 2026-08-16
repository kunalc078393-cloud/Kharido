import React from 'react'
import { useState, useEffect } from 'react'
import api from '../services/api'
import Loading from '../components/Loading'
import Error from '../components/Error'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'



function OrderPage() {
    const { cart, cartTotal } = useSelector((state) => state.cart);
    const [error , setError] = useState();
    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        phoneNo: null,
        addressLine: "",
        city: "",
        state: "",
        pincode: null
    })
    const [fieldErrors, setFieldErrors] = useState({
        fullName: "",
        phoneNo: null,
        addressLine: "",
        city: "",
        state: "",
        pincode: null

    })
    const [expanded, setExpanded] = useState("summary");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const Navigate = useNavigate();
    useEffect(() => {




    }, [])
    const toggleSection = (section) => {
        setExpanded(expanded === section ? null : section);
    };

    const handlePlaceOrder = () => {
        const errors = {
            fullName: validate("fullName", shippingAddress.fullName),
            phoneNo: validate("phoneNo", shippingAddress.phoneNo),
            addressLine: validate("addressLine", shippingAddress.addressLine),
            city: validate("city", shippingAddress.city),
            state: validate("state", shippingAddress.state),
            pincode: validate("pincode", shippingAddress.pincode),
        };
    
        if (Object.values(errors).some(error => error)) {
            return;
        }

        
        setShowConfirm(true)

    }

    const confirmOrder = async () => {
        try {
            setShowConfirm(false);
            shippingAddress.phoneNo = Number(shippingAddress.phoneNo);
            shippingAddress.pincode = Number(shippingAddress.pincode)
            const response = await api.post("/orders",{shippingAddress});
            setOrderPlaced(true);
            
        } catch (error) {
            setError(
                error.response?.data?.message || "Placing order failed"
            )

            
        }
       
    }



    const validate = (name, value) => {
        let message = ""

        if (name == "fullName") {
            if (!value) {
                message = "Name can't be empty"
            }
        }
        else if (name == "phoneNo") {
            if (!value) {
                message = "Phone Number can't be empty"
            }
            else if (value.length != 10 || Number(value) === NaN) {
                message = "Invalid Phone No"

            }
        }
        else if (name == "addressLine") {
            if (!value) {
                message = "Address can't be empty"
            }
        }

        else if (name == "state") {
            const states = [
                "andhra pradesh",
                "arunachal pradesh",
                "assam",
                "bihar",
                "chhattisgarh",
                "goa",
                "gujarat",
                "haryana",
                "himachal pradesh",
                "jharkhand",
                "karnataka",
                "kerala",
                "madhya pradesh",
                "maharashtra",
                "manipur",
                "meghalaya",
                "mizoram",
                "nagaland",
                "odisha",
                "punjab",
                "rajasthan",
                "sikkim",
                "tamil nadu",
                "telangana",
                "tripura",
                "uttar pradesh",
                "uttarakhand",
                "west bengal"
            ];

            if (!value) {
                message = "State can't be empty"
            }
            else if (!states.includes(value.toLowerCase())) {
                message = "Invalid state"
            }
        }
        else if (name == "city") {
            if (!value) {
                message = "City can't be empty"
            }

        }
        else if (name == "pincode") {
            if (!value) {
                message = "Pincode can't be empty";
            }
            else if (value.length != 6 || Number(value) === NaN) {
                message = "Invalid Pinncode"
            }
        }
        setFieldErrors((prev) => ({
            ...prev,
            [name]: message
        }))
        return message;


    }
    const handleChange = (e) => {
        const { name, value } = e.target;

        validate(name, value);


        setShippingAddress((prev) => ({
            ...prev,
            [name]: value
        }))
    }



    return (
        <div className="min-h-screen bg-[#eaeaea] p-8">
            <h1 className="text-3xl font-bold text-[#183e4b] mb-8">Place Your Order</h1>

            {
                error && (
                    <Error error = {error}/>
                )
            }

            {/* Accordion Sections */}
            <div className="space-y-6">
                {/* 1. Order Summary */}
                <div className="bg-white rounded-lg shadow-md">
                    <button
                        onClick={() => toggleSection("summary")}
                        className="w-full text-left px-6 py-4 font-semibold text-[#183e4b] flex justify-between items-center"
                    >
                        Order Summary
                        <span>{expanded === "summary" ? "▲" : "▼"}</span>
                    </button>
                    {expanded === "summary" && (
                        <div className="px-6 pb-4 divide-y divide-[#eaeaea]">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 py-3">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-contain border border-[#8ba0a4] rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-[#183e4b]">{item.product.name}</p>
                                        <p className="text-sm text-[#1b4552]">₹{item.product.price} × {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-[#d74a49]">
                                        ₹{item.product.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4">
                                <h3 className="text-lg font-bold text-[#183e4b]">Cart Total:</h3>
                                <p className="text-xl font-extrabold text-[#d74a49]">₹{cartTotal}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Contact Info */}
                <div className="bg-white rounded-lg shadow-md">
                    <button
                        onClick={() => toggleSection("contact")}
                        className="w-full text-left px-6 py-4 font-semibold text-[#183e4b] flex justify-between items-center"
                    >
                        Contact Info
                        <span>{expanded === "contact" ? "▲" : "▼"}</span>
                    </button>
                    {expanded === "contact" && (
                        <div className="px-6 pb-4 space-y-3">
                            <input onChange={handleChange} type="text" value={shippingAddress.fullName} placeholder="Full Name" name="fullName" className="w-full px-3 py-2 border rounded" />
                            {fieldErrors.fullName ? (<p className="text-[#d74a49] text-sm mt-1">{fieldErrors.fullName}</p>) : ""}
                            <input onChange={handleChange} type="text" value={shippingAddress.phoneNo} placeholder="Phone Number" name="phoneNo" className="w-full px-3 py-2 border rounded" />
                            {fieldErrors.phoneNo ? (<p className="text-[#d74a49] text-sm mt-1">{fieldErrors.phoneNo}</p>) : ""}

                        </div>
                    )}
                </div>

                {/* 3. Address Info */}
                <div className="bg-white rounded-lg shadow-md">
                    <button
                        onClick={() => toggleSection("address")}
                        className="w-full text-left px-6 py-4 font-semibold text-[#183e4b] flex justify-between items-center"
                    >
                        Address Info
                        <span>{expanded === "address" ? "▲" : "▼"}</span>
                    </button>
                    {expanded === "address" && (
                        <div className="px-6 pb-4 space-y-3">

                            <input onChange={handleChange} type="text" value={shippingAddress.addressLine} name='addressLine' placeholder="Address Line" className="w-full px-3 py-2 border rounded" />
                            {fieldErrors.addressLine ? (<p className="text-[#d74a49] text-sm mt-1">{fieldErrors.addressLine}</p>) : ""}

                            <input onChange={handleChange} type="text" name='city' value={shippingAddress.city} placeholder="City" className="w-full px-3 py-2 border rounded" />
                            {fieldErrors.city ? (<p className="text-[#d74a49] text-sm mt-1">{fieldErrors.city}</p>) : ""}

                            <input onChange={handleChange} type="text" name='state' value={shippingAddress.state} placeholder="State" className="w-full px-3 py-2 border rounded" />
                            {fieldErrors.state ? (<p className="text-[#d74a49] text-sm mt-1">{fieldErrors.state}</p>) : ""}

                            <input onChange={handleChange} type="text" name='pincode' value={shippingAddress.pincode} placeholder="Pincode" className="w-full px-3 py-2 border rounded" />
                            {fieldErrors.pincode ? (<p className="text-[#d74a49] text-sm mt-1">{fieldErrors.pincode}</p>) : ""}

                        </div>
                    )}
                </div>

                {/* 4. Payment Method */}
                <div className="bg-white rounded-lg shadow-md">
                    <button
                        onClick={() => toggleSection("payment")}
                        className="w-full text-left px-6 py-4 font-semibold text-[#183e4b] flex justify-between items-center"
                    >
                        Payment Method
                        <span>{expanded === "payment" ? "▲" : "▼"}</span>
                    </button>
                    {expanded === "payment" && (
                        <div className="px-6 pb-4">
                            <select className="w-full px-3 py-2 border rounded">
                                <option value="cod">Cash on Delivery</option>
                                <option value="disabled" disabled>Credit/Debit Card (Unavailable)</option>
                                <option value="disabled" disabled>UPI (Unavailable)</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* 5. Order Confirmation */}
                <div className="bg-white rounded-lg shadow-md mt-6">
                    <button
                        onClick={() => toggleSection("confirm")}
                        className="w-full text-left px-6 py-4 font-semibold text-[#183e4b] flex justify-between items-center"
                    >
                        Order Confirmation
                        <span>{expanded === "confirm" ? "▲" : "▼"}</span>
                    </button>
                    {expanded === "confirm" && (
                        <div className="px-6 pb-4">
                            <button
                                onClick={handlePlaceOrder}
                                className="w-full px-6 py-2 rounded-lg bg-[#d74a49] text-white font-semibold hover:bg-[#1b4552] transition"
                            >
                                Place Order
                            </button>
                        </div>
                    )}
                </div>

                {/* Confirmation Popup Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <h2 className="text-xl font-bold text-[#183e4b] mb-4">Confirm Order</h2>
                            <p className="text-[#1b4552] mb-6">
                                Are you sure you want to place this order?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 rounded bg-[#8ba0a4] text-white hover:bg-[#1b4552] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmOrder}
                                    className="px-4 py-2 rounded bg-[#d74a49] text-white hover:bg-[#1b4552] transition"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Popup */}
                {orderPlaced && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                            <h2 className="text-xl font-bold text-green-600 mb-4">✅ Order Placed!</h2>
                            <p className="text-[#1b4552] mb-6">
                                Your order has been placed successfully.
                            </p>
                            <button
                                onClick={() => Navigate("/")}
                                className="px-4 py-2 rounded bg-[#d74a49] text-white hover:bg-[#1b4552] transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderPage