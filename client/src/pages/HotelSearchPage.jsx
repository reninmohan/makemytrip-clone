import HotelFilters from "../components/HotelFilters";
import HotelSearchResults from "../components/HotelSearchResults";
import { Toaster } from "react-hot-toast";

import { useState } from "react";

export default function HotelSearchPage() {
  const [filters, setFilters] = useState({
    minPrice: 500,
    maxPrice: 50000,
    selectedAmenities: [],
    selectedRating: null,
  });

  return (
    <div className="container mx-auto py-6">
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <HotelFilters filters={filters} setFilters={setFilters} />
        </div>
        <div className="md:col-span-3">
          <HotelSearchResults filters={filters} />
        </div>
      </div>
    </div>
  );
}
