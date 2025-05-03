import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "react-hot-toast"; // Added Toaster
import { Clock } from "lucide-react";
import api from "../axiosConfig";

function FlightSearchResults({ filters }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");

  const { minPrice, maxPrice, stops, selectedAirlines, departureTimes, arrivalTimes } = filters || {};

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const departDate = searchParams.get("departDate") || "";
  const seatClass = searchParams.get("class") || "";

  const sortFlights = (flights) => {
    return [...flights].sort((a, b) => {
      let priceA, priceB;
      switch (sortBy) {
        case "price-low":
          priceA = typeof a.price === "object" ? a.price.economy : a.price;
          priceB = typeof b.price === "object" ? b.price.economy : b.price;
          return priceA - priceB;
        case "price-high":
          priceA = typeof a.price === "object" ? a.price.economy : a.price;
          priceB = typeof b.price === "object" ? b.price.economy : b.price;
          return priceB - priceA;
        case "duration":
          return a.duration - b.duration;
        case "departure":
          return new Date(a.departureTime) - new Date(b.departureTime);
        case "arrival":
          return new Date(a.arrivalTime) - new Date(b.arrivalTime);
        default:
          return 0;
      }
    });
  };

  const fetchFlights = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);

    try {
      const response = await api.get("/api/flights/search", {
        params: {
          from,
          to,
          departDate,
          seatClass,
          minPrice,
          maxPrice,
          isNonStop: stops === "nonStop" ? true : undefined,
          airline: selectedAirlines,
          departTimeRange: departureTimes.length > 0 ? departureTimes : undefined,
          arrivalTimeRange: arrivalTimes.length > 0 ? arrivalTimes : undefined,
        },
      });

      setFlights(response.data?.data.flights || []);
    } catch (error) {
      console.error("Failed to fetch flights", error);
      toast.error("Failed to load flight data.");
      setFetchError("Failed to load flight data.");
    } finally {
      setFetchLoading(false);
    }
  }, [from, to, departDate, seatClass, minPrice, maxPrice, stops, arrivalTimes, departureTimes, selectedAirlines]);
  console.log("fligth", flights);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFlights();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchFlights]);

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <Card className="border-destructive">
        <CardContent className="text-destructive pt-6 text-center">
          <p>{fetchError}</p>
          <Button variant="outline" className="mt-4" onClick={fetchFlights}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (flights.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-muted-foreground text-center">
            <p>No flights found with current filters. Please try changing the filter.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = sortFlights(flights);

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <Toaster position="top-right" />

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Flights {from && to && `from ${from} to ${to}`}</h2>
          <p className="text-muted-foreground">{flights.length} results found</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="duration">Duration (Shortest First)</SelectItem>
              <SelectItem value="departure">Departure Time (Earliest First)</SelectItem>
              <SelectItem value="arrival">Arrival Time (Earliest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((flight) => (
          <Card key={flight.id} className="mr-4">
            <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative h-10 w-10">
                  <img
                    src={flight.airline.logo || "/placeholder.svg"}
                    alt={flight.airline.name}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{flight.airline.name}</h3>
                  <p className="text-muted-foreground text-sm">{flight.flightNumber}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <span className="text-xl font-semibold">
                  {new Date(flight.departureTime)
                    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
                    .toUpperCase()}
                </span>
                <span className="text-muted-foreground text-sm">
                  {flight.departureAirport.city} ({flight.departureAirport.code})
                </span>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  {`${Math.floor(flight.duration / 60)}Hr ${flight.duration % 60}m`}
                </span>
                <span className="text-muted-foreground">→</span>
                <div className="text-muted-foreground px-2 text-xs">{flight.isNonStop ? "Nonstop" : "Connecting"}</div>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <span className="text-xl font-semibold">
                  {new Date(flight.arrivalTime)
                    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
                    .toUpperCase()}
                </span>
                <span className="text-muted-foreground text-sm">
                  {flight.arrivalAirport.city} ({flight.arrivalAirport.code})
                </span>
              </div>

              <div className="flex flex-1 flex-col items-end gap-2">
                <div className="text-center">
                  <span className="text-muted-foreground text-sm">Starting from </span>
                  {/* Handle both price structures (object or number) */}
                  <div className="text-xl font-bold">
                    ₹{typeof flight.price === "object" ? flight.price.economy : flight.price}
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/booking/flight/book/${flight.id}`)}
                  className="w-25"
                >
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FlightSearchResults;
