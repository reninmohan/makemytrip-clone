import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Wifi, Car, WavesLadder, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Bath, Utensils, Wine, Bus } from "lucide-react";
import api from "../axiosConfig.js";
import toast from "react-hot-toast";

function HotelSearchResults({ filters }) {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");

  const { minPrice, maxPrice, selectedAmenities, selectedRating } = filters;

  const destination = searchParams.get("destination") || "";
  const checkInDate = searchParams.get("checkInDate") || "";
  const checkOutDate = searchParams.get("checkOutDate") || "";
  const capacity = searchParams.get("capacity") || "1";

  const filterHotels = (hotels) => {
    return hotels.filter((hotel) => {
      if (selectedAmenities.length > 0) {
        const hasAllSelectedAmenities = selectedAmenities.every((amenity) =>
          hotel.amenities.includes(amenity.toUpperCase()),
        );
        if (!hasAllSelectedAmenities) return false;
      }

      // Filter by rating
      if (selectedRating > 0 && Math.floor(Number(hotel.rating)) !== selectedRating) {
        return false;
      }

      // Filter by price range
      const lowestRoomPrice =
        hotel.roomTypes?.reduce(
          (min, room) => (room.pricePerNight < min.pricePerNight ? room : min),
          hotel.roomTypes?.[0],
        )?.pricePerNight || 0;

      if (minPrice && lowestRoomPrice < minPrice) return false;
      if (maxPrice && lowestRoomPrice > maxPrice) return false;

      return true;
    });
  };

  const sortHotels = (hotels) => {
    return [...hotels].sort((a, b) => {
      const aLowestPrice =
        a.roomTypes?.reduce((min, room) => (room.pricePerNight < min.pricePerNight ? room : min), a.roomTypes?.[0])
          ?.pricePerNight || 0;
      const bLowestPrice =
        b.roomTypes?.reduce((min, room) => (room.pricePerNight < min.pricePerNight ? room : min), b.roomTypes?.[0])
          ?.pricePerNight || 0;

      switch (sortBy) {
        case "price-low":
          return aLowestPrice - bLowestPrice;
        case "price-high":
          return bLowestPrice - aLowestPrice;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0; // recommended - no sorting
      }
    });
  };

  const fetchHotels = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);

    try {
      const response = await api.get("api/hotels/search/", {
        params: {
          destination,
          checkInDate,
          checkOutDate,
          capacity,
          minPrice,
          maxPrice,
          rating: selectedRating,
          amenities: selectedAmenities.map((amenity) => amenity.toUpperCase()).join(","),
        },
      });
      setHotels(response.data?.data?.hotels || []);
    } catch (err) {
      console.error("Error fetching hotel:", err);
      setFetchError("Failed to load hotel data. Please try again.");
      toast.error("Failed to load hotel data. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  }, [destination, checkInDate, checkOutDate, capacity, minPrice, maxPrice, selectedRating, selectedAmenities]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchHotels();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimer);
  }, [fetchHotels]);

  const amenityIcons = {
    PARKING: <Car className="h-4 w-4" />,
    GYM: <Dumbbell className="h-4 w-4" />,
    POOL: <WavesLadder className="h-4 w-4" />,
    SPA: <Bath className="h-4 w-4" />,
    RESTAURANT: <Utensils className="h-4 w-4" />,
    BAR: <Wine className="h-4 w-4" />,
    WIFI: <Wifi className="h-4 w-4" />,
    AIRPORT_SHUTTLE: <Bus className="h-4 w-4" />,
  };

  const getAmenityIcon = (id) => {
    return amenityIcons[id] || <Check className="h-4 w-4" />;
  };

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive text-center">
            <p>{fetchError}</p>
            <Button variant="outline" className="mt-4">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hotels.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-muted-foreground text-center">
            <p>No hotels found with mentioned filters please try change filter.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          {destination ? (
            <h1 className="text-2xl font-bold">Hotels with Destination {destination}</h1>
          ) : (
            <h1 className="text-2xl font-bold">All Hotels </h1>
          )}
          <p className="text-muted-foreground">Showing {filterHotels(hotels).length} properties</p>
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
              <SelectItem value="rating">Rating (Highest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {sortHotels(filterHotels(hotels)).map((hotel) => {
          // const firstRoom = hotel.roomTypes?.[0];
          // const originalPrice = firstRoom?.pricePerNight * 1.2; // Example markup for original price
          const lowestRoom = hotel.roomTypes?.reduce(
            (min, room) => (room.pricePerNight < min.pricePerNight ? room : min),
            hotel.roomTypes?.[0],
          );

          return (
            <Card key={hotel.id} className="mr-4 overflow-hidden">
              <div className="flex h-full flex-col md:flex-row">
                <div className="relative h-60 flex-shrink-0 md:h-64 md:w-1/3">
                  <img
                    src={hotel.images?.[0] || "/placeholder.svg"}
                    alt={hotel.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div className="space-y-2">
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{hotel.location?.city || "Unknown"}</span>
                      </div>
                      <h3 className="text-xl font-semibold">{hotel.name}</h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity) => (
                          <div
                            key={amenity}
                            className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs"
                          >
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-4">
                      <div className="bg-primary/10 flex items-center gap-1 rounded px-2 py-1">
                        <span className="font-semibold">{hotel.rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-muted-foreground w-15 text-sm">
                          ({hotel.roomTypes?.length || 0} rooms)
                        </span>
                      </div>

                      <div className="text-right md:mt-0">
                        {/* {originalPrice && originalPrice > lowestRoom?.pricePerNight && <div className="text-muted-foreground text-sm line-through"> ₹{originalPrice} per night</div>} */}
                        <span className="text-muted-foreground text-sm">Starting from </span>
                        <p className="text-2xl font-bold">₹{lowestRoom?.pricePerNight}</p>
                        <p className="text-muted-foreground text-sm">per night</p>
                        <Button asChild className="mt-2 hover:bg-blue-700" variant="primary">
                          <Link
                            to={`/hotels/${hotel.id}?destination=${encodeURIComponent(destination)}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&capacity=${capacity}`}
                          >
                            View Deal
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default HotelSearchResults;
