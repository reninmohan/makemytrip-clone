import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FlightSearchForm from "../components/FlightSearchForm";
// import { popularDestinationCarousel } from "../mockdata";

const FlightRecommended = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recommended destinations
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, we'll use mock data
        // const response = await axios.get('/api/destinations/recommended');
        // setDestinations(response.data);

        // Mock data
        const mockDestinations = [
          {
            id: 1,
            name: "New York",
            country: "United States",
            image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
            description: "Experience the vibrant culture and iconic landmarks of the city that never sleeps.",
            price: 299,
          },
          {
            id: 2,
            name: "Paris",
            country: "France",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
            description: "Discover the romance and charm of the City of Light with its world-class cuisine and art.",
            price: 449,
          },
          {
            id: 3,
            name: "Tokyo",
            country: "Japan",
            image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
            description: "Immerse yourself in the perfect blend of traditional culture and futuristic technology.",
            price: 799,
          },
          {
            id: 4,
            name: "Rome",
            country: "Italy",
            image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
            description: "Walk through history in the Eternal City with its ancient ruins and Renaissance masterpieces.",
            price: 399,
          },
          {
            id: 5,
            name: "Sydney",
            country: "Australia",
            image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
            description: "Enjoy the stunning harbor views and laid-back lifestyle of Australia's iconic city.",
            price: 899,
          },
          {
            id: 6,
            name: "Dubai",
            country: "UAE",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
            description: "Experience luxury and innovation in this ultramodern desert metropolis.",
            price: 599,
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
    navigate(`/flights/search?${queryString}`);
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
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Discover Your Next Adventure</h1>
            <p className="mx-auto max-w-3xl text-xl md:text-2xl">Explore our recommended destinations and find the best flight deals</p>
          </div>

          {/* Search Box */}
          <div className="mt-12 overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Search Flights</h2>
              <FlightSearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Destinations */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Recommended Destinations</h2>

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
                    <p className="mb-4 line-clamp-2 h-10 text-sm text-gray-600">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">From ${destination.price}</span>
                      <button onClick={() => navigate(`/flights/search?to=${destination.name}`)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700">
                        Find Flights
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Popular Flight Routes */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Popular Flight Routes</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { from: "New York", to: "Los Angeles", price: 199 },
              { from: "Chicago", to: "Miami", price: 149 },
              { from: "San Francisco", to: "Seattle", price: 129 },
              { from: "Boston", to: "Washington DC", price: 99 },
              { from: "Dallas", to: "Las Vegas", price: 179 },
              { from: "Atlanta", to: "Denver", price: 159 },
            ].map((route, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {route.from} to {route.to}
                    </h3>
                    <p className="text-sm text-gray-500">One-way flight</p>
                  </div>
                  <span className="font-bold text-blue-600">${route.price}</span>
                </div>
                <button onClick={() => navigate(`/flights/search?from=${route.from}&to=${route.to}`)} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700">
                  Search
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightRecommended;
