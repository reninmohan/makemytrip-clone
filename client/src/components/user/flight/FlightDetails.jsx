"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/axiosConfig";
import { toast } from "react-hot-toast";

const FlightDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState("economy");

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!flightId) {
        setError("Invalid flight ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/flights/${flightId}`);
        if (!response.data?.data) {
          throw new Error("No flight data received");
        }
        setFlight(response.data.data);
      } catch (err) {
        console.error("Error fetching flight details:", err);
        setError(err.response?.data?.message || "Failed to load flight details");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  const handleBookFlight = () => {
    if (!flight?.id || !selectedClass) {
      toast.error("Please select a valid flight class");
      return;
    }
    navigate(`/booking/flight/book/${flightId}?class=${selectedClass}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="text-red-500">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">{error || "Flight not found"}</h2>
        <button onClick={() => navigate(-1)} className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Flight Summary */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {flight.departureCity} to {flight.arrivalCity}
              </h1>
              <p className="mt-1 text-gray-600">
                {new Date(flight.departureTime).toLocaleDateString()} • {flight.airline?.name} • Flight {flight.flightNumber}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">{flight.stops === 0 ? "Nonstop" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="text-2xl font-bold">{new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              <p className="text-lg font-medium">
                {flight.departureAirport?.code} - {flight.departureAirport?.city}
              </p>
              <p className="text-sm text-gray-500">{new Date(flight.departureTime).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 text-sm text-gray-500">{flight.duration} hours</p>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200"></div>
                </div>
                <div className="relative flex justify-between">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  {flight.stops > 0 && (
                    <div className="h-3 w-3 rounded-full bg-red-500">
                      <div className="absolute top-5 -ml-10 text-xs whitespace-nowrap text-gray-500">
                        {flight.stopCity} ({flight.stopAirport})
                        <br />
                        {flight.stopDuration} layover
                      </div>
                    </div>
                  )}
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{flight.stops === 0 ? "Nonstop" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Arrival</p>
              <p className="text-2xl font-bold">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              <p className="text-lg font-medium">
                {flight.arrivalAirport?.code} - {flight.arrivalAirport?.city}
              </p>
              <p className="text-sm text-gray-500">{new Date(flight.arrivalTime).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Flight Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Airline:</span> {flight.airline.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Flight Number:</span> {flight.flightNumber}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Aircraft:</span> {flight.aircraft || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Duration:</span> {flight.duration} hours
              </p>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Select Your Fare</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {["economy", "premium", "business", "first"].map(
              (classType) =>
                flight.price?.[classType] && (
                  <div key={classType} className={`cursor-pointer rounded-lg border p-4 transition-colors duration-200 ${selectedClass === classType ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} onClick={() => setSelectedClass(classType)}>
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 capitalize">{classType}</h3>
                      <div className="flex items-center">
                        <input type="radio" name="class" checked={selectedClass === classType} onChange={() => setSelectedClass(classType)} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      </div>
                    </div>
                    <p className="mb-2 text-2xl font-bold text-blue-600">₹{flight.price[classType]}</p>
                    <p className="mb-4 text-sm text-gray-500">per passenger</p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Available Seats:</span> {flight.availableSeats?.[classType] || "Not specified"}
                      </p>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Booking Summary</h2>
          <div className="mb-4 border-b pb-4">
            <div className="mb-2 flex justify-between">
              <span className="text-gray-700">Base Fare ({selectedClass})</span>
              <span className="font-medium">₹{flight.price?.[selectedClass] || 0}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-700">Taxes & Fees</span>
              <span className="font-medium">₹{Math.round((flight.price?.[selectedClass] || 0) * 0.15)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">Total</p>
              <p className="text-sm text-gray-500">per passenger</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{Math.round((flight.price?.[selectedClass] || 0) * 1.15)}</p>
          </div>
          <button onClick={handleBookFlight} className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700">
            Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
