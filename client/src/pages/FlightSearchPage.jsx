import { useState } from "react";
import FlightSearchResults from "../components/FlightSearchResults";
import FlightFilters from "../components/FlightFilters";

export default function FlightSearchPage() {
  const [priceRange, setPriceRange] = useState([2000, 100000]);
  const [minPrice, setMinPrice] = useState(2000);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [stops, setStops] = useState("any");
  const [departureTimes, setDepartureTimes] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            <FlightFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              stops={stops}
              setStops={setStops}
              departureTimes={departureTimes}
              setDepartureTimes={setDepartureTimes}
              arrivalTimes={arrivalTimes}
              setArrivalTimes={setArrivalTimes}
              selectedAirlines={selectedAirlines}
              setSelectedAirlines={setSelectedAirlines}
            />
            <FlightSearchResults
              filters={{
                priceRange,
                minPrice,
                maxPrice,
                stops,
                selectedAirlines,
                departureTimes,
                arrivalTimes,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
