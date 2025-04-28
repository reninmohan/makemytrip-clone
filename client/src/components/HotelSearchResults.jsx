import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MapPin, Star, Wifi, Car, Coffee, Check } from "lucide-react";

function HotelSearchResults() {
  const [sortBy, setSortBy] = useState("recommended");

  // Mock data for hotel search results
  const hotels = [
    {
      id: 1,
      name: "Grand Plaza Hotel",
      location: "Downtown, New York",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: 16500,
      originalPrice: 20650,
      rating: 4.8,
      reviews: 324,
      amenities: ["Free WiFi", "Free Parking", "Breakfast Included"],
      promoted: true,
      distance: "0.5 miles from center",
    },
    {
      id: 2,
      name: "Oceanview Resort & Spa",
      location: "Beachfront, Miami",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: 24850,
      originalPrice: 29800,
      rating: 4.9,
      reviews: 512,
      amenities: ["Free WiFi", "Pool", "Spa", "Breakfast Included"],
      promoted: false,
      distance: "On the beach",
    },
    {
      id: 3,
      name: "City Lights Boutique Hotel",
      location: "Theater District, New York",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: 14850,
      originalPrice: 17350,
      rating: 4.6,
      reviews: 208,
      amenities: ["Free WiFi", "Restaurant", "Bar"],
      promoted: false,
      distance: "1.2 miles from center",
    },
    {
      id: 4,
      name: "Mountain View Lodge",
      location: "Uptown, Denver",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: 12350,
      originalPrice: 15700,
      rating: 4.5,
      reviews: 186,
      amenities: ["Free WiFi", "Free Parking", "Pet Friendly"],
      promoted: false,
      distance: "3.5 miles from center",
    },
    {
      id: 5,
      name: "Riverside Luxury Suites",
      location: "River District, Chicago",
      image: "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: 21500,
      originalPrice: 24850,
      rating: 4.7,
      reviews: 273,
      amenities: ["Free WiFi", "Gym", "Room Service"],
      promoted: false,
      distance: "0.8 miles from center",
    },
  ];

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "Free WiFi":
        return <Wifi className="h-4 w-4" />;
      case "Free Parking":
        return <Car className="h-4 w-4" />;
      case "Breakfast Included":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Hotels in New York</h1>
          <p className="text-muted-foreground">Showing {hotels.length} properties</p>
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
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="mr-4 overflow-hidden">
            <div className="flex h-full flex-col md:flex-row">
              {/* IMAGE SECTION */}
              <div className="relative h-60 flex-shrink-0 md:h-64 md:w-1/3">
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="h-full w-full object-cover" />
              </div>

              {/* CONTENT SECTION */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div className="space-y-2">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{hotel.location}</span>
                    </div>
                    <h3 className="text-xl font-semibold">{hotel.name}</h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity) => (
                        <div key={amenity} className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div className="bg-primary/10 flex items-center gap-1 rounded px-2 py-1">
                      <span className="font-semibold">{hotel.rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-muted-foreground text-sm">({hotel.reviews})</span>
                    </div>

                    <div className="mt-4 text-right md:mt-0">
                      {hotel.originalPrice > hotel.price && <div className="text-muted-foreground text-sm line-through">${hotel.originalPrice} per night</div>}
                      <div className="text-2xl font-bold">₹{hotel.price}</div>
                      <div className="text-muted-foreground text-sm">per night</div>
                      <Button asChild className="mt-2" variant="primary">
                        <Link href={`/hotels/${hotel.id}`}>View Deal</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default HotelSearchResults;
