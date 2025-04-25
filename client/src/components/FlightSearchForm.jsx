"use client";

import { useState } from "react";

const FlightSearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("roundtrip");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("economy");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      from,
      to,
      departDate,
      returnDate: tripType === "roundtrip" ? returnDate : "",
      tripType,
      passengers,
      travelClass,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="tripType" className="mb-1 block text-sm font-medium text-gray-700">
            Trip Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio text-blue-600" name="tripType" value="roundtrip" checked={tripType === "roundtrip"} onChange={() => setTripType("roundtrip")} />
              <span className="ml-2 text-gray-700">Round Trip</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio text-blue-600" name="tripType" value="oneway" checked={tripType === "oneway"} onChange={() => setTripType("oneway")} />
              <span className="ml-2 text-gray-700">One Way</span>
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="travelClass" className="mb-1 block text-sm font-medium text-gray-700">
            Travel Class
          </label>
          <select id="travelClass" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
            <option value="economy">Economy</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="from" className="mb-1 block text-sm font-medium text-gray-700">
            From
          </label>
          <input type="text" id="from" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="City or Airport" value={from} onChange={(e) => setFrom(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="to" className="mb-1 block text-sm font-medium text-gray-700">
            To
          </label>
          <input type="text" id="to" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="City or Airport" value={to} onChange={(e) => setTo(e.target.value)} required />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="departDate" className="mb-1 block text-sm font-medium text-gray-700">
            Depart Date
          </label>
          <input type="date" id="departDate" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={departDate} onChange={(e) => setDepartDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required />
        </div>
        {tripType === "roundtrip" && (
          <div>
            <label htmlFor="returnDate" className="mb-1 block text-sm font-medium text-gray-700">
              Return Date
            </label>
            <input type="date" id="returnDate" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={departDate || new Date().toISOString().split("T")[0]} required={tripType === "roundtrip"} />
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="passengers" className="mb-1 block text-sm font-medium text-gray-700">
            Passengers
          </label>
          <select id="passengers" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={passengers} onChange={(e) => setPassengers(Number.parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Passenger" : "Passengers"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700">
        Search Flights
      </button>
    </form>
  );
};

export default FlightSearchForm;
