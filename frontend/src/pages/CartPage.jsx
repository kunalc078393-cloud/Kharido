import React, { useEffect } from 'react'
import {useDispatch , useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { clearCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';



function CartPage() {
  const { cart, cartTotal, error, loading , operatingCart} = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error error={error} />
  }

  const handleClearCart = async() => {
    await dispatch(clearCart());

  }

  const handleCheckOut =()=>{
    navigate("/checkout")
    
  }


  return (
    < div className="min-h-screen bg-[#eaeaea] p-8" >
      <h1 className="text-3xl font-bold text-[#183e4b] mb-8">Your Cart</h1>

      {
        cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-10">
            <p className="text-xl font-semibold text-[#1b4552] mb-4">
              Your cart is empty
            </p>
            <Link
              to="/products"
              className="px-6 py-2 rounded-lg bg-[#d74a49] text-white font-semibold hover:bg-[#1b4552] transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Cart Items */}
            <div className="divide-y divide-[#eaeaea]">
              {cart.items.map((item, index) => (
                <div key={index} className="flex items-center gap-6 py-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex items-center justify-center border border-[#8ba0a4] rounded-lg bg-[#f9f9f9]">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#183e4b]">
                      {item.product.name}
                    </h2>
                    {/* <p className="text-sm text-[#1b4552]">
                      Category: {item.category.name}
                    </p> */}
                    <p className="text-sm text-[#1b4552]">
                      Price: ₹{item.product.price}
                    </p>
                    <p className="text-sm text-[#1b4552]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#d74a49]">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <h3 className="text-xl font-bold text-[#183e4b]">Total:</h3>
              <p className="text-2xl font-extrabold text-[#d74a49]">₹{cartTotal}</p>
            </div>




    
            <div className="mt-6 flex justify-end gap-1">
              {/* clear cart */}
              <button
                onClick={handleClearCart}
                className="px-6 py-2 rounded-lg bg-[#8ba0a4] text-white font-semibold hover:bg-[#1b4552] transition"
              >
                {operatingCart? "clearing ..." : "clear cart"}
              </button>
              {/* Checkout Button */}
              <button
                onClick={handleCheckOut}
                className="px-6 py-2 rounded-lg bg-[#d74a49] text-white font-semibold hover:bg-[#1b4552] transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default CartPage