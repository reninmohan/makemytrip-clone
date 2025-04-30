import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import api from "../axiosConfig";

function FlightSearchResults({ filters }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");

  const { minPrice, maxPrice, stops, selectedAirlines, departureTimes, arrivalTimes } = filters || {};

  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";
  const departureDate = searchParams.get("departureDate") || "";

  const filterFlights = (flights) => {
    if (!Array.isArray(flights)) return [];

    return flights.filter((flight) => {
      const price = flight.price || 0;
      if (price < minPrice || price > maxPrice) return false;
      if (stops !== "any" && flight.stops !== Number(stops)) return false;
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false;
      if (
        departureTimes.length > 0 &&
        !departureTimes.some((range) => {
          const hour = parseInt(flight.departureTime?.split(":")[0], 10);
          return hour >= range.start && hour <= range.end;
        })
      )
        return false;

      if (
        arrivalTimes.length > 0 &&
        !arrivalTimes.some((range) => {
          const hour = parseInt(flight.arrivalTime?.split(":")[0], 10);
          return hour >= range.start && hour <= range.end;
        })
      )
        return false;

      return true;
    });
  };

  const sortFlights = (flights) => {
    return [...flights].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "duration":
          return a.duration - b.duration;
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
        // params: {
        //   origin,
        //   destination,
        //   departureDate,
        // },
      });
      setFlights(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch flights", error);
      toast.error("Failed to load flight data.");
      setFetchError("Failed to load flight data.");
    } finally {
      setFetchLoading(false);
    }
  }, [origin, destination, departureDate]);

  console.log(flights);
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
          <Button variant="outline" className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const filtered = filterFlights(flights);
  const sorted = sortFlights(filtered);

  if (filtered.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-6 text-center">
          <p>No flights found with current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Flights {origin && destination && `from ${origin} to ${destination}`}</h2>
          <p className="text-muted-foreground">{filtered.length} results found</p>
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((flight) => (
          <Card key={flight.id}>
            <CardContent className="flex flex-col items-center justify-between gap-4 p-4 md:flex-row">
              <div className="flex w-full items-center justify-between gap-8">
                {/* Airline Logo and Info */}
                <div className="flex items-center gap-3">
                  <img src={flight.airline.logo} alt={flight.airline.name} className="h-12 w-12 object-contain" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">{flight.airline.name}</h3>
                    <p className="text-muted-foreground text-sm">{flight.flightNumber}</p>
                  </div>
                </div>

                {/* Departure */}
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold">{new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="text-muted-foreground text-sm">
                    {flight.departureAirport.city} ({flight.departureAirport.code})
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex h-full items-center">
                  <span className="text-muted-foreground">→</span>
                </div>

                {/* Arrival */}
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="text-muted-foreground text-sm">
                    {flight.arrivalAirport.city} ({flight.arrivalAirport.code})
                  </span>
                </div>

                {/* Price, Duration and Book Button */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-xl font-bold">₹{flight.price.economy}</div>
                    <div className="text-muted-foreground text-sm">
                      {flight.duration} hrs • {flight.isNonStop ? "Non-stop" : `${flight.stops || 1} stops`}
                    </div>
                  </div>
                  <Button variant="primary" onClick={() => navigate(`/flights/${flight.id}`)} className="w-full">
                    Select
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FlightSearchResults;
