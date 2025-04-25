"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlightSearchForm from "../components/FlightSearchForm";
import FlightCard from "../components/FlightCard";
import FlightFilters from "../components/FlightFilters";

// Mock data for flights
const mockFlights = [
  {
    id: "f1",
    airline: "Delta Airlines",
    flightNumber: "DL1234",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    departureTime: "08:00 AM",
    arrivalTime: "11:30 AM",
    duration: "5h 30m",
    price: {
      economy: 299,
      premium: 499,
      business: 899,
      first: 1299,
    },
    stops: 0,
    availableSeats: 45,
  },
  {
    id: "f2",
    airline: "American Airlines",
    flightNumber: "AA5678",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    departureTime: "10:15 AM",
    arrivalTime: "02:45 PM",
    duration: "6h 30m",
    price: {
      economy: 279,
      premium: 479,
      business: 849,
      first: 1249,
    },
    stops: 1,
    stopAirport: "DFW",
    stopCity: "Dallas",
    availableSeats: 32,
  },
  {
    id: "f3",
    airline: "United Airlines",
    flightNumber: "UA9012",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    departureTime: "12:30 PM",
    arrivalTime: "04:00 PM",
    duration: "5h 30m",
    price: {
      economy: 319,
      premium: 519,
      business: 919,
      first: 1319,
    },
    stops: 0,
    availableSeats: 28,
  },
  {
    id: "f4",
    airline: "JetBlue",
    flightNumber: "B6789",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    departureTime: "03:45 PM",
    arrivalTime: "07:15 PM",
    duration: "5h 30m",
    price: {
      economy: 289,
      premium: 489,
      business: 889,
      first: null,
    },
    stops: 0,
    availableSeats: 38,
  },
  {
    id: "f5",
    airline: "Southwest Airlines",
    flightNumber: "WN3456",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    departureTime: "06:00 PM",
    arrivalTime: "11:30 PM",
    duration: "7h 30m",
    price: {
      economy: 259,
      premium: null,
      business: null,
      first: null,
    },
    stops: 1,
    stopAirport: "PHX",
    stopCity: "Phoenix",
    availableSeats: 52,
  },
];

const FlightSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price");
  const [filters, setFilters] = useState({
    airlines: [],
    maxPrice: 2000,
    stops: "any",
    departureTime: "any",
  });

  // Get search params from URL
  const searchParams = {
    from: queryParams.get("from") || "",
    to: queryParams.get("to") || "",
    departDate: queryParams.get("departDate") || "",
    returnDate: queryParams.get("returnDate") || "",
    tripType: queryParams.get("tripType") || "roundtrip",
    passengers: Number.parseInt(queryParams.get("passengers") || "1"),
    travelClass: queryParams.get("travelClass") || "economy",
  };

  useEffect(() => {
    // Simulate API call to fetch flights
    setLoading(true);
    setTimeout(() => {
      setFlights(mockFlights);
      setFilteredFlights(mockFlights);
      setLoading(false);
    }, 1000);
  }, [location.search]);

  const handleSearch = (newSearchParams) => {
    // Convert search params to query string
    const queryString = new URLSearchParams(newSearchParams).toString();
    navigate(`/flights?${queryString}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Apply filters
    let result = [...flights];

    // Filter by airlines
    if (newFilters.airlines.length > 0) {
      result = result.filter((flight) => newFilters.airlines.includes(flight.airline));
    }

    // Filter by price
    result = result.filter((flight) => flight.price[searchParams.travelClass] <= newFilters.maxPrice);

    // Filter by stops
    if (newFilters.stops !== "any") {
      const stops = Number.parseInt(newFilters.stops);
      result = result.filter((flight) => flight.stops === stops);
    }

    // Filter by departure time
    if (newFilters.departureTime !== "any") {
      result = result.filter((flight) => {
        const hour = Number.parseInt(flight.departureTime.split(":")[0]);
        const isPM = flight.departureTime.includes("PM");
        const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

        switch (newFilters.departureTime) {
          case "morning":
            return hour24 >= 5 && hour24 < 12;
          case "afternoon":
            return hour24 >= 12 && hour24 < 18;
          case "evening":
            return hour24 >= 18 || hour24 < 5;
          default:
            return true;
        }
      });
    }

    setFilteredFlights(result);
  };

  const handleSortChange = (value) => {
    setSortBy(value);

    const sorted = [...filteredFlights];

    switch (value) {
      case "price":
        sorted.sort((a, b) => a.price[searchParams.travelClass] - b.price[searchParams.travelClass]);
        break;
      case "duration":
        sorted.sort((a, b) => {
          const durationA = Number.parseInt(a.duration.split("h")[0]) * 60 + Number.parseInt(a.duration.split("h")[1].split("m")[0]);
          const durationB = Number.parseInt(b.duration.split("h")[0]) * 60 + Number.parseInt(b.duration.split("h")[1].split("m")[0]);
          return durationA - durationB;
        });
        break;
      case "departure":
        sorted.sort((a, b) => {
          const timeA = new Date(`2023-01-01 ${a.departureTime}`);
          const timeB = new Date(`2023-01-01 ${b.departureTime}`);
          return timeA - timeB;
        });
        break;
      case "arrival":
        sorted.sort((a, b) => {
          const timeA = new Date(`2023-01-01 ${a.arrivalTime}`);
          const timeB = new Date(`2023-01-01 ${b.arrivalTime}`);
          return timeA - timeB;
        });
        break;
      default:
        break;
    }

    setFilteredFlights(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Modify Search</h2>
          <FlightSearchForm onSearch={handleSearch} initialValues={searchParams} />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Filters */}
          <div className="w-full md:w-1/4">
            <FlightFilters flights={flights} travelClass={searchParams.travelClass} onFilterChange={handleFilterChange} filters={filters} />
          </div>

          {/* Results */}
          <div className="w-full md:w-3/4">
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <h2 className="text-xl font-semibold">
                  {searchParams.from} to {searchParams.to}
                </h2>
                <div className="mt-2 flex items-center sm:mt-0">
                  <label htmlFor="sortBy" className="mr-2 text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select id="sortBy" className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="price">Price</option>
                    <option value="duration">Duration</option>
                    <option value="departure">Departure Time</option>
                    <option value="arrival">Arrival Time</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-500">
                {searchParams.departDate} • {searchParams.passengers} {searchParams.passengers === 1 ? "Passenger" : "Passengers"} • {searchParams.travelClass.charAt(0).toUpperCase() + searchParams.travelClass.slice(1)}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="h-8 w-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : filteredFlights.length > 0 ? (
                <div className="space-y-6">
                  {filteredFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} travelClass={searchParams.travelClass} passengers={searchParams.passengers} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No flights found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
