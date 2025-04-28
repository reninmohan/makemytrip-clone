import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HotelBookedCard } from "@/components/HotelBookedCard";
import { FlightBookedCard } from "@/components/FlightBookedCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const hotelBookings = [
  {
    hotelName: "Grand Hyatt",
    location: "Mumbai, India",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18",
    guests: "2 Adults, 1 Child",
    roomType: "Deluxe Room",
    price: 15000,
    bookingId: "HOTEL123456",
    image: "/hotel-placeholder.jpg",
  },
  {
    hotelName: "Taj Mahal Palace",
    location: "Mumbai, India",
    checkIn: "2024-04-01",
    checkOut: "2024-04-03",
    guests: "2 Adults",
    roomType: "Luxury Suite",
    price: 25000,
    bookingId: "HOTEL789012",
    image: "/hotel-placeholder.jpg",
  },
];

const flightBookings = [
  {
    route: "Mumbai → Delhi",
    airline: "Air India",
    departureTime: "10:00 AM",
    arrivalTime: "12:30 PM",
    passengers: "2 Adults",
    class: "Economy",
    price: 8000,
    tripType: "Round Trip",
    bookingId: "FLIGHT123456",
    image: "/flight-placeholder.jpg",
  },
  {
    route: "Delhi → Mumbai",
    airline: "IndiGo",
    departureTime: "03:00 PM",
    arrivalTime: "05:30 PM",
    passengers: "2 Adults",
    class: "Business",
    price: 12000,
    tripType: "One Way",
    bookingId: "FLIGHT789012",
    image: "/flight-placeholder.jpg",
  },
];

export function UserBookingSection() {
  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">All Hotel Booking</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your hotel booking,or edit existing ones (coming soon).</CardDescription>
        </CardHeader>
        <CardContent className="mb-6 space-y-4">
          <Tabs defaultValue="hotels" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="flights">Flights</TabsTrigger>
            </TabsList>

            <TabsContent value="hotels" className="space-y-4">
              {hotelBookings.map((booking) => (
                <HotelBookedCard key={booking.bookingId} booking={booking} />
              ))}
            </TabsContent>

            <TabsContent value="flights" className="space-y-4">
              {flightBookings.map((booking) => (
                <FlightBookedCard key={booking.bookingId} booking={booking} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
