import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Luggage, Wifi, Power, Monitor } from "lucide-react";

function FlightSearchResults() {
  const [sortBy, setSortBy] = useState("recommended");

  // Mock data for flight search results
  const flights = [
    {
      id: 1,
      airline: "Delta Airlines",
      airlineCode: "DL",
      airlineLogo: "/placeholder.svg?height=40&width=40",
      departureTime: "08:30 AM",
      departureAirport: "JFK",
      departureCity: "New York",
      arrivalTime: "11:45 AM",
      arrivalAirport: "LAX",
      arrivalCity: "Los Angeles",
      duration: "6h 15m",
      stops: 0,
      price: 349,
      originalPrice: 429,
      promoted: true,
      amenities: ["Wi-Fi", "Power Outlets", "In-flight Entertainment"],
      flightNumber: "DL 1234",
    },
    {
      id: 2,
      airline: "United Airlines",
      airlineCode: "UA",
      airlineLogo: "/placeholder.svg?height=40&width=40",
      departureTime: "10:15 AM",
      departureAirport: "JFK",
      departureCity: "New York",
      arrivalTime: "01:45 PM",
      arrivalAirport: "LAX",
      arrivalCity: "Los Angeles",
      duration: "6h 30m",
      stops: 0,
      price: 329,
      originalPrice: 389,
      promoted: false,
      amenities: ["Wi-Fi", "Power Outlets"],
      flightNumber: "UA 5678",
    },
    {
      id: 3,
      airline: "American Airlines",
      airlineCode: "AA",
      airlineLogo: "/placeholder.svg?height=40&width=40",
      departureTime: "12:30 PM",
      departureAirport: "JFK",
      departureCity: "New York",
      arrivalTime: "04:15 PM",
      arrivalAirport: "LAX",
      arrivalCity: "Los Angeles",
      duration: "6h 45m",
      stops: 1,
      stopAirport: "DFW",
      stopCity: "Dallas",
      stopDuration: "1h 20m",
      price: 299,
      originalPrice: 359,
      promoted: false,
      amenities: ["Wi-Fi", "In-flight Entertainment"],
      flightNumber: "AA 9012",
    },
    {
      id: 4,
      airline: "JetBlue Airways",
      airlineCode: "B6",
      airlineLogo: "/placeholder.svg?height=40&width=40",
      departureTime: "03:45 PM",
      departureAirport: "JFK",
      departureCity: "New York",
      arrivalTime: "07:10 PM",
      arrivalAirport: "LAX",
      arrivalCity: "Los Angeles",
      duration: "6h 25m",
      stops: 0,
      price: 319,
      originalPrice: 379,
      promoted: false,
      amenities: ["Wi-Fi", "Power Outlets", "In-flight Entertainment"],
      flightNumber: "B6 3456",
    },
    {
      id: 5,
      airline: "Southwest Airlines",
      airlineCode: "WN",
      airlineLogo: "/placeholder.svg?height=40&width=40",
      departureTime: "06:20 AM",
      departureAirport: "LGA",
      departureCity: "New York",
      arrivalTime: "11:15 AM",
      arrivalAirport: "LAX",
      arrivalCity: "Los Angeles",
      duration: "7h 55m",
      stops: 1,
      stopAirport: "MDW",
      stopCity: "Chicago",
      stopDuration: "1h 35m",
      price: 279,
      originalPrice: 339,
      promoted: false,
      amenities: ["Wi-Fi"],
      flightNumber: "WN 7890",
    },
  ];

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "Wi-Fi":
        return <Wifi className="h-4 w-4" />;
      case "Power Outlets":
        return <Power className="h-4 w-4" />;
      case "In-flight Entertainment":
        return <Monitor className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Flights from New York to Los Angeles</h1>
          <p className="text-muted-foreground">Showing {flights.length} flights on Jun 15, 2023</p>
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
              <SelectItem value="departure">Departure (Earliest First)</SelectItem>
              <SelectItem value="arrival">Arrival (Earliest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="best" className="w-full">
        <TabsList className="mb-4 grid w-full max-w-md grid-cols-4 rounded-xl">
          <TabsTrigger value="best">Best</TabsTrigger>
          <TabsTrigger value="cheapest">Cheapest</TabsTrigger>
          <TabsTrigger value="fastest">Fastest</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="best" className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id} className="mr-4 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Airline Info */}
                  <div className="flex items-center gap-3 lg:w-1/5">
                    <div className="relative h-10 w-10">
                      <img src={flight.airlineLogo || "/placeholder.svg"} alt={flight.airline} className="object-contain" />
                    </div>
                    <div>
                      <div className="font-medium">{flight.airline}</div>
                      <div className="text-muted-foreground text-sm">{flight.flightNumber}</div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-3">
                    {/* Departure */}
                    <div className="text-center md:text-left">
                      <div className="text-xl font-semibold">{flight.departureTime}</div>
                      <div className="text-sm">{flight.departureAirport}</div>
                      <div className="text-muted-foreground text-sm">{flight.departureCity}</div>
                    </div>

                    {/* Flight Path */}
                    <div className="flex flex-col items-center">
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {flight.duration}
                      </div>
                      <div className="relative my-2 flex w-full items-center justify-center">
                        <div className="border-muted-foreground absolute w-full border-t border-dashed"></div>
                        <div className="bg-background text-muted-foreground z-10 px-2 text-xs">
                          {flight.stops === 0 ? (
                            "Nonstop"
                          ) : (
                            <>
                              {flight.stops} stop in {flight.stopCity} ({flight.stopAirport})
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center md:text-right">
                      <div className="text-xl font-semibold">{flight.arrivalTime}</div>
                      <div className="text-sm">{flight.arrivalAirport}</div>
                      <div className="text-muted-foreground text-sm">{flight.arrivalCity}</div>
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="mt-4 flex flex-row items-center justify-between lg:mt-0 lg:w-1/5 lg:flex-col lg:items-end">
                    <div className="flex flex-col items-end">
                      {flight.originalPrice > flight.price && <div className="text-muted-foreground text-sm line-through">₹{flight.originalPrice}</div>}
                      <div className="text-2xl font-bold">₹{flight.price}</div>
                      <div className="text-muted-foreground text-xs">per person</div>
                    </div>

                    <Button asChild className="mt-2" variant="primary">
                      <Link href={`/flights/${flight.id}`}>Select</Link>
                    </Button>
                  </div>
                </div>

                {/* Flight Amenities */}
                <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
                  {flight.amenities.map((amenity) => (
                    <div key={amenity} className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                  <div className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                    <Luggage className="h-4 w-4" />
                    <span>Carry-on included</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cheapest" className="space-y-4">
          {/* Show cheapest flights */}
          {flights
            .sort((a, b) => a.price - b.price)
            .slice(0, 3)
            .map((flight) => (
              <Card key={flight.id} className="overflow-hidden">
                {/* Same flight card content as above */}
                <div className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Airline Info */}
                    <div className="flex items-center gap-3 lg:w-1/5">
                      <div className="relative h-10 w-10">
                        <img src={flight.airlineLogo || "/placeholder.svg"} alt={flight.airline} className="object-contain" />
                      </div>
                      <div>
                        <div className="font-medium">{flight.airline}</div>
                        <div className="text-muted-foreground text-sm">{flight.flightNumber}</div>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-3">
                      {/* Departure */}
                      <div className="text-center md:text-left">
                        <div className="text-xl font-semibold">{flight.departureTime}</div>
                        <div className="text-sm">{flight.departureAirport}</div>
                        <div className="text-muted-foreground text-sm">{flight.departureCity}</div>
                      </div>

                      {/* Flight Path */}
                      <div className="flex flex-col items-center">
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {flight.duration}
                        </div>
                        <div className="relative my-2 flex w-full items-center justify-center">
                          <div className="border-muted-foreground absolute w-full border-t border-dashed"></div>
                          <div className="bg-background text-muted-foreground z-10 px-2 text-xs">
                            {flight.stops === 0 ? (
                              "Nonstop"
                            ) : (
                              <>
                                {flight.stops} stop in {flight.stopCity} ({flight.stopAirport})
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="text-center md:text-right">
                        <div className="text-xl font-semibold">{flight.arrivalTime}</div>
                        <div className="text-sm">{flight.arrivalAirport}</div>
                        <div className="text-muted-foreground text-sm">{flight.arrivalCity}</div>
                      </div>
                    </div>

                    {/* Price and Booking */}
                    <div className="mt-4 flex flex-row items-center justify-between lg:mt-0 lg:w-1/5 lg:flex-col lg:items-end">
                      <div className="flex flex-col items-end">
                        {flight.originalPrice > flight.price && <div className="text-muted-foreground text-sm line-through">₹{flight.originalPrice}</div>}
                        <div className="text-2xl font-bold">₹{flight.price}</div>
                        <div className="text-muted-foreground text-xs">per person</div>
                      </div>

                      <Button asChild className="mt-2" variant="primary">
                        <Link href={`/flights/${flight.id}`}>Select</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Flight Amenities */}
                  <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
                    {flight.amenities.map((amenity) => (
                      <div key={amenity} className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                    <div className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                      <Luggage className="h-4 w-4" />
                      <span>Carry-on included</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="fastest" className="space-y-4">
          {/* Show fastest flights */}
          {flights
            .filter((flight) => flight.stops === 0)
            .sort((a, b) => {
              const durationA = Number.parseInt(a.duration.split("h")[0]) * 60 + Number.parseInt(a.duration.split("h")[1].split("m")[0]);
              const durationB = Number.parseInt(b.duration.split("h")[0]) * 60 + Number.parseInt(b.duration.split("h")[1].split("m")[0]);
              return durationA - durationB;
            })
            .slice(0, 3)
            .map((flight) => (
              <Card key={flight.id} className="overflow-hidden">
                {/* Same flight card content as above */}
                <div className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Airline Info */}
                    <div className="flex items-center gap-3 lg:w-1/5">
                      <div className="relative h-10 w-10">
                        <img src={flight.airlineLogo || "/placeholder.svg"} alt={flight.airline} className="object-contain" />
                      </div>
                      <div>
                        <div className="font-medium">{flight.airline}</div>
                        <div className="text-muted-foreground text-sm">{flight.flightNumber}</div>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-3">
                      {/* Departure */}
                      <div className="text-center md:text-left">
                        <div className="text-xl font-semibold">{flight.departureTime}</div>
                        <div className="text-sm">{flight.departureAirport}</div>
                        <div className="text-muted-foreground text-sm">{flight.departureCity}</div>
                      </div>

                      {/* Flight Path */}
                      <div className="flex flex-col items-center">
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {flight.duration}
                        </div>
                        <div className="relative my-2 flex w-full items-center justify-center">
                          <div className="border-muted-foreground absolute w-full border-t border-dashed"></div>
                          <div className="bg-background text-muted-foreground z-10 px-2 text-xs">
                            {flight.stops === 0 ? (
                              "Nonstop"
                            ) : (
                              <>
                                {flight.stops} stop in {flight.stopCity} ({flight.stopAirport})
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="text-center md:text-right">
                        <div className="text-xl font-semibold">{flight.arrivalTime}</div>
                        <div className="text-sm">{flight.arrivalAirport}</div>
                        <div className="text-muted-foreground text-sm">{flight.arrivalCity}</div>
                      </div>
                    </div>

                    {/* Price and Booking */}
                    <div className="mt-4 flex flex-row items-center justify-between lg:mt-0 lg:w-1/5 lg:flex-col lg:items-end">
                      <div className="flex flex-col items-end">
                        {flight.originalPrice > flight.price && <div className="text-muted-foreground text-sm line-through">₹{flight.originalPrice}</div>}
                        <div className="text-2xl font-bold">₹{flight.price}</div>
                        <div className="text-muted-foreground text-xs">per person</div>
                      </div>

                      <Button asChild className="mt-2" variant="primary">
                        <Link href={`/flights/${flight.id}`}>Select</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Flight Amenities */}
                  <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
                    {flight.amenities.map((amenity) => (
                      <div key={amenity} className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                    <div className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                      <Luggage className="h-4 w-4" />
                      <span>Carry-on included</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {/* Show all flights */}
          {flights.map((flight) => (
            <Card key={flight.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Airline Info */}
                  <div className="flex items-center gap-3 lg:w-1/5">
                    <div className="relative h-10 w-10">
                      <img src={flight.airlineLogo || "/placeholder.svg"} alt={flight.airline} className="object-contain" />
                    </div>
                    <div>
                      <div className="font-medium">{flight.airline}</div>
                      <div className="text-muted-foreground text-sm">{flight.flightNumber}</div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-3">
                    {/* Departure */}
                    <div className="text-center md:text-left">
                      <div className="text-xl font-semibold">{flight.departureTime}</div>
                      <div className="text-sm">{flight.departureAirport}</div>
                      <div className="text-muted-foreground text-sm">{flight.departureCity}</div>
                    </div>

                    {/* Flight Path */}
                    <div className="flex flex-col items-center">
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {flight.duration}
                      </div>
                      <div className="relative my-2 flex w-full items-center justify-center">
                        <div className="border-muted-foreground absolute w-full border-t border-dashed"></div>
                        <div className="bg-background text-muted-foreground z-10 px-2 text-xs">
                          {flight.stops === 0 ? (
                            "Nonstop"
                          ) : (
                            <>
                              {flight.stops} stop in {flight.stopCity} ({flight.stopAirport})
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center md:text-right">
                      <div className="text-xl font-semibold">{flight.arrivalTime}</div>
                      <div className="text-sm">{flight.arrivalAirport}</div>
                      <div className="text-muted-foreground text-sm">{flight.arrivalCity}</div>
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="mt-4 flex flex-row items-center justify-between lg:mt-0 lg:w-1/5 lg:flex-col lg:items-end">
                    <div className="flex flex-col items-end">
                      {flight.originalPrice > flight.price && <div className="text-muted-foreground text-sm line-through">₹{flight.originalPrice}</div>}
                      <div className="text-2xl font-bold">₹{flight.price}</div>
                      <div className="text-muted-foreground text-xs">per person</div>
                    </div>

                    <Button asChild className="mt-2" variant="primary">
                      <Link href={`/flights/${flight.id}`}>Select</Link>
                    </Button>
                  </div>
                </div>

                {/* Flight Amenities */}
                <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
                  {flight.amenities.map((amenity) => (
                    <div key={amenity} className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                  <div className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                    <Luggage className="h-4 w-4" />
                    <span>Carry-on included</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

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
export default FlightSearchResults;
