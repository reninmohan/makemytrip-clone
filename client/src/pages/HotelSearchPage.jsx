import HotelFilters from "../components/HotelFilters";
import HotelSearchResults from "../components/HotelSearchResults";

import { useState } from "react";

export default function HotelSearchPage() {
  const [filters, setFilters] = useState({
    minPrice: 500,
    maxPrice: 50000,
    selectedAmenities: [],
    selectedRating: null,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            <HotelFilters filters={filters} setFilters={setFilters} />
            <HotelSearchResults filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
}
