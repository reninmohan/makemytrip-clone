import { useState } from "react";
import FlightSearchResults from "../components/FlightSearchResults";
import FlightFilters from "../components/FlightFilters";
import { Toaster } from "react-hot-toast";

export default function FlightSearchPage() {
  const [filters, setFilters] = useState({
    minPrice: 2000,
    maxPrice: 20000,
    stops: "any",
    departureTimes: [],
    arrivalTimes: [],
    selectedAirlines: [],
  });

  return (
    <div className="container mx-auto py-6">
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <FlightFilters filters={filters} setFilters={setFilters} />
        </div>
        <div className="md:col-span-3">
          <FlightSearchResults filters={filters} />
        </div>
      </div>
    </div>
  );
}
