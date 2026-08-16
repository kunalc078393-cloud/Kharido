import React from 'react'
import { useState, useEffect } from 'react'
import { getProducts } from '../services/productsServices'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Error from '../components/Error'
import Card from '../components/Card'
import NoProductFound from '../components/NoProductFound'


function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);


    const limit = 3


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getProducts({ page, limit });
                console.log("products : ", response.products);
                setProducts(response.products);
   


            } catch (error) {
                console.log("an error has occured");
                setError(error.response?.data?.message || "Error has occured");

            }
            finally {
                setLoading(false);
            };
        }
        fetchProducts();




    }, [page]);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

  
    const handlePrev = () => {

        setPage((prev)=> prev-1)

    }

    const handleNext = () => {

        setPage((prev)=> prev+1)
    }


    return (
        <div className="min-h-screen bg-[#eaeaea] p-8">
            {/* Page Heading */}
            <h1 className="text-3xl font-bold text-center text-[#183e4b] mb-10">
                Featured Products
            </h1>

            {/* Product Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">


                {
                    products.map((product , index) => {
                        return (
                            <Card key={index} product={product}/>
                        );
                    })
                }
                

            </div>
            {
                    products.length == 0 && <NoProductFound/>
            }
            <div className="flex justify-center items-center gap-4 mt-8">
                {/* Prev Button */}
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-[#d74a49] text-white font-semibold 
                        hover:bg-[#1b4552] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ◀ Prev
                </button>

                {/* Page Indicator */}
                <span className="text-[#183e4b] font-medium">
                    Page {page} 
                </span>



                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={ products.length < limit}
                    className="px-4 py-2 rounded-lg bg-[#d74a49] text-white font-semibold 
                        hover:bg-[#1b4552] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next ▶
                </button>
            </div>

        </div>

    )
}

export default ProductsPage