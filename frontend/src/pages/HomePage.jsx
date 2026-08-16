import { useState, useEffect } from "react";
import welcome from "../assets/welcome.png"
import slide1 from "../assets/slide1.png"
import slide2 from "../assets/slide2.png"
import slide3 from "../assets/slide3.png"
import api from "../services/api";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { Link } from "react-router-dom";

function HomePage() {

  const slides = [slide1, slide2, slide3]

  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {


    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await api.get("/categories");
        setCategories(response.data.categories);

      } catch (error) {
        setError(
          error.response?.data?.message || "category fetching failed"
        );

      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [])




  const [current, setCurrent] = useState(0);

  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <main className="min-h-screen bg-[#f9f9f9]">

      {/* Welcome Poster */}
      <section className="relative w-full h-[400px] bg-gradient-to-r from-[#f0f4f5] via-[#cfd8dc] to-[#8ba0a4] flex items-center justify-center text-[#183e4b]">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Kharido</h1>
          <p className="text-lg max-w-xl mx-auto">
            Discover amazing products, exclusive deals, and a shopping
            experience designed just for you.
          </p>

          <Link to="/products">
            <button className="mt-6 px-6 py-2 rounded-lg bg-[#d74a49] hover:bg-[#9e2a2b] transition font-semibold text-white">
              Shop Now
            </button>
          </Link>
        </div>
      </section>



      {/* Carousel */}
      <section className="relative w-full max-w-6xl mx-auto mt-12">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <img
            src={slides[current]}
            alt={`slide-${current}`}
            className="w-full h-[420px] object-cover transition-transform duration-700 ease-in-out hover:scale-105"
          />
        </div>
        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-white text-[#183e4b] px-4 py-2 rounded-full shadow hover:bg-[#f0f4f5] transition"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-white text-[#183e4b] px-4 py-2 rounded-full shadow hover:bg-[#f0f4f5] transition"
        >
          ›
        </button>
        {/* Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ${current === i ? "bg-[#d74a49]" : "bg-gray-300"}`}
            ></button>
          ))}
        </div>
      </section>




      {/* Horizontal Category Slider */}
      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} />
      ) : categories && (
        <section className="mt-16 px-6">
          <h2 className="text-3xl font-bold text-[#183e4b] mb-8">Shop by Category</h2>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="min-w-[200px] bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-xl"></div>
                </div>
                <div className="p-4 text-center">
                  <p className="font-semibold text-[#183e4b]">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      )}

    </main>
  );
}

export default HomePage;
