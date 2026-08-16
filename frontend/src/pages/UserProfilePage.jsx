import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../services/api';
import Loading from '../components/Loading';

function UserProfilePage() {
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await api.get("/orders");
                console.log(response)
                console.log(response.data.orders);
                setOrders(response.data.orders)
                console.log(orders)

            } catch (error) {
                console.log(error.response?.data?.message || "Order fetching failed");
                setError(
                    error.response?.data?.message || "Order fetching failed"
                );
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
        

    }, [])
    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
      };

    return (
        <>
            <div className="min-h-screen bg-[#eaeaea] p-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-[#183e4b] mb-2">Profile</h1>
                    <p className="text-lg text-[#1b4552]">
                        <span className="font-semibold">Full Name:</span> {user.fullName}
                    </p>
                    <p className="text-lg text-[#1b4552]">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                </div>

                {/* Orders Section */}

                {!orders ? (<Loading />) : (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#183e4b] mb-4">Your Orders</h2>

                        {orders.length === 0 ? (
                            <p className="text-[#1b4552] italic">No orders found.</p>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="border border-[#8ba0a4] rounded-lg p-4 shadow-sm"
                                    >
                                        {/* Order Summary */}
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#183e4b]">
                                                    Order #{order._id}
                                                </h3>
                                                <p className="text-sm text-[#1b4552]">
                                                    Status:{" "}
                                                    <span
                                                        className={
                                                            order.status === "Completed"
                                                                ? "text-green-600 font-medium"
                                                                : "text-yellow-600 font-medium"
                                                        }
                                                    >
                                                        {order.status}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-[#d74a49]">
                                                    ₹{order.totalAmount}
                                                </p>
                                                <button
                                                onClick={() => toggleOrder(order._id)}
                                                className="mt-2 px-3 py-1 rounded bg-[#8ba0a4] text-white text-sm font-semibold hover:bg-[#1b4552] transition"
                                            >
                                                {expandedOrder === order._id ? "Hide Details" : "View Details"}
                                            </button>
                                            </div>
                                        </div>

                                        {/* Expanded Order Items */}
                                        {expandedOrder === order._id && (
                                        <div className="mt-4 divide-y divide-[#eaeaea]">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 py-3">
                                              
                                                    <div className="w-20 h-20 flex items-center justify-center border border-[#8ba0a4] rounded-lg bg-[#f9f9f9]">
                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>

                                                  
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-[#183e4b]">
                                                            {item.name}
                                                        </p>
                                                        {/* <p className="text-sm text-[#1b4552]">
                                                            Category: {item.category.name}
                                                        </p> */}
                                                        <p className="text-sm text-[#1b4552]">
                                                            Price: ₹{item.price}
                                                        </p>
                                                        <p className="text-sm text-[#1b4552]">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>

                                           
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-[#d74a49]">
                                                            ₹{item.itemTotal}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                )}

            </div>


        </>
    )
}

export default UserProfilePage