"use client";

import { useState } from "react";

const HotelSearchForm = ({ onSearch }) => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      destination,
      checkIn,
      checkOut,
      rooms,
      adults,
      children,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="destination" className="mb-1 block text-sm font-medium text-gray-700">
          Destination
        </label>
        <input type="text" id="destination" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="City, Hotel, or Specific Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="checkIn" className="mb-1 block text-sm font-medium text-gray-700">
            Check-in Date
          </label>
          <input type="date" id="checkIn" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split("T")[0]} required />
        </div>
        <div>
          <label htmlFor="checkOut" className="mb-1 block text-sm font-medium text-gray-700">
            Check-out Date
          </label>
          <input type="date" id="checkOut" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split("T")[0]} required />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="rooms" className="mb-1 block text-sm font-medium text-gray-700">
            Rooms
          </label>
          <select id="rooms" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={rooms} onChange={(e) => setRooms(Number.parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Room" : "Rooms"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="adults" className="mb-1 block text-sm font-medium text-gray-700">
            Adults
          </label>
          <select id="adults" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={adults} onChange={(e) => setAdults(Number.parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="children" className="mb-1 block text-sm font-medium text-gray-700">
            Children
          </label>
          <select id="children" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={children} onChange={(e) => setChildren(Number.parseInt(e.target.value))}>
            {[0, 1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Child" : "Children"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700">
        Search Hotels
      </button>
    </form>
  );
};

export default HotelSearchForm;
