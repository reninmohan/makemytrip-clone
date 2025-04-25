import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlightSearchForm from "../components/FlightSearchForm";
import HotelSearchForm from "../components/HotelSearchForm";
import FeaturedDestinations from "../components/FeaturedDestinations";
import SpecialOffers from "../components/SpecialOffers";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const navigate = useNavigate();

  const handleFlightSearch = (searchParams) => {
    // Convert search params to query string
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/flights?${queryString}`);
  };

  const handleHotelSearch = (searchParams) => {
    // Convert search params to query string
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/hotels?${queryString}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Find Your Perfect Trip</h1>
            <p className="mx-auto max-w-3xl text-xl md:text-2xl">Find and book the best deals on flights and hotels worldwide</p>
          </div>

          {/* Search Box */}
          <div className="mt-12 overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex border-b">
              <button className={`flex-1 py-4 text-center font-medium ${activeTab === "flights" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("flights")}>
                <svg className="mr-2 inline-block h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                Flights
              </button>
              <button className={`flex-1 py-4 text-center font-medium ${activeTab === "hotels" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("hotels")}>
                <svg className="mr-2 inline-block h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Hotels
              </button>
            </div>
            <div className="p-6">{activeTab === "flights" ? <FlightSearchForm onSearch={handleFlightSearch} /> : <HotelSearchForm onSearch={handleHotelSearch} />}</div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* Special Offers */}
      <SpecialOffers />
    </div>
  );
};

export default Homepage;
