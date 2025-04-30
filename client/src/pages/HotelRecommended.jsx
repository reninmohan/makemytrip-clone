import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HotelSearchForm from "../components/HotelSearchForm";

const HotelRecommended = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);

        const mockDestinations = [
          {
            id: 1,
            name: "Bali",
            country: "Indonesia",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
            description: "Tropical paradise with stunning beaches and vibrant culture.",
            hotels: 245,
          },
          {
            id: 2,
            name: "Santorini",
            country: "Greece",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
            description: "Iconic white buildings with breathtaking views of the Aegean Sea.",
            hotels: 189,
          },
          {
            id: 3,
            name: "Kyoto",
            country: "Japan",
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
            description: "Ancient temples and traditional gardens in Japan's cultural heart.",
            hotels: 210,
          },
          {
            id: 4,
            name: "Barcelona",
            country: "Spain",
            image: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
            description: "Stunning architecture and Mediterranean beaches in Catalonia.",
            hotels: 312,
          },
          {
            id: 5,
            name: "Maldives",
            country: "Maldives",
            image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
            description: "Luxury overwater bungalows in crystal clear turquoise waters.",
            hotels: 156,
          },
          {
            id: 6,
            name: "Marrakech",
            country: "Morocco",
            image: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea",
            description: "Vibrant markets and exotic architecture in this historic city.",
            hotels: 178,
          },
        ];

        setDestinations(mockDestinations);
        setLoading(false);
      } catch (err) {
        setError("Failed to load recommended destinations");
        setLoading(false);
        console.error(err);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (searchParams) => {
    // Convert search params to query string
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/hotels/search?${queryString}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Find Your Perfect Stay</h1>
            <p className="mx-auto max-w-3xl text-xl md:text-2xl">Discover amazing hotels and accommodations around the world</p>
          </div>

          {/* Search Box */}
          <div className="mt-12 overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Search Hotels</h2>
              <HotelSearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Destinations */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Popular Destinations</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="h-8 w-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <Slider {...settings} className="destination-slider">
            {destinations.map((destination) => (
              <div key={destination.id} className="px-2">
                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                  <div className="relative h-64">
                    <img src={destination.image || "/placeholder.svg"} alt={destination.name} className="h-full w-full object-cover" />
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                      <p className="text-sm text-white">{destination.country}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-4 text-sm text-gray-600">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">{destination.hotels} Hotels</span>
                      <button onClick={() => navigate(`/hotels/search?destination=${destination.name}`)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700">
                        Find Hotels
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Featured Hotels */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Featured Hotels</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Grand Plaza Hotel", location: "New York", price: 199, rating: 4.8 },
              { name: "Oceanview Resort & Spa", location: "Miami", price: 299, rating: 4.9 },
              { name: "Mountain View Lodge", location: "Denver", price: 149, rating: 4.7 },
              { name: "City Lights Boutique Hotel", location: "Chicago", price: 179, rating: 4.6 },
              { name: "Sunset Beach Resort", location: "San Diego", price: 249, rating: 4.8 },
              { name: "Historic Downtown Inn", location: "Boston", price: 189, rating: 4.5 },
            ].map((hotel, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-gray-500">{hotel.location}</p>
                  </div>
                  <div className="flex items-center rounded-lg bg-blue-100 px-2 py-1 text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold">{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">${hotel.price} / night</span>
                  <button onClick={() => navigate(`/hotels/search?destination=${hotel.location}`)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRecommended;
