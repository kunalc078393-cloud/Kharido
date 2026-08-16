import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productsServices';
import NoProductFound from "../components/NoProductFound";
import Error from "../components/Error"
import Loading from "../components/Loading"
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useSelector } from 'react-redux';


function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageNo , setImageNo] = useState(0);
    const {operatingCart} = useSelector((state)=> state.cart)

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await getProductById(id);


                setProduct(response.product);

            } catch (error) {
                setError(error.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();


    }, [])

    console.log(product)


    if (loading) {
        return <Loading />
    }
    

    if (error) {
        return <Error error={error} />
    }

    const handleImage = (index) => {
        setImageNo(index);

    }
    
    const handleAddToCart = async () => {
        try {
           await dispatch(addToCart({productId:product._id})).unwrap();
        } catch (error) {
            setError(error.response?.data?.message || "Error occured")
            
        }

    }



    return (
        <div className="min-h-screen bg-[#eaeaea] flex items-center justify-center p-8">


            {product ? (
                <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg border border-[#8ba0a4] overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/2 bg-[#f9f9f9] flex flex-col items-center justify-center p-4">
                        <div className="w-full h-72 flex items-center justify-center border border-[#8ba0a4] rounded-lg mb-4">
                            <img
                                src={product.images[imageNo]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.map((url, index) => (
                                <img
                                    onClick={() => handleImage(index)}
                                    key={index}
                                    src={url}
                                    alt={`Thumbnail ${index}`}
                                    className="w-20 h-20 object-contain border border-[#8ba0a4] rounded cursor-pointer hover:border-[#d74a49]"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/2 p-6 flex flex-col">
                        <h1 className="text-3xl font-bold text-[#183e4b] mb-2">{product.name}</h1>
                        <p className="text-lg text-[#1b4552] mb-2">Brand: <span className="font-semibold">{product.brand}</span></p>
                        <p className="text-lg text-[#1b4552] mb-2">Category: <span className="font-semibold">{product.category.name}</span></p>

                        <p className="text-[#1b4552] mb-4">{product.description}</p>

                        <p className="text-2xl font-extrabold text-[#d74a49] mb-2">₹{product.price}</p>
                        <p className={`text-sm font-medium mb-2 ${product.isActive ? "text-green-600" : "text-red-600"}`}>
                            {product.isActive ? "Available" : "Out of Stock"}
                        </p>
                        <p className="text-sm text-[#1b4552] mb-6">Stock: {product.stock}</p>


                        <div className="mt-auto flex gap-4">
                            <button 
                            onClick={handleAddToCart}
                            className="flex-1 px-4 py-2 rounded-lg bg-[#d74a49] text-white font-semibold hover:bg-[#1b4552] transition">
                               {operatingCart? "adding ..." : "Add to Cart"}
                            </button>
                            <button className="flex-1 px-4 py-2 rounded-lg bg-[#8ba0a4] text-white font-semibold hover:bg-[#1b4552] transition">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            ) : (<NoProductFound />)}

        </div>
    )
}

export default ProductDetailsPage