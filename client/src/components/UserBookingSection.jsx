import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HotelBookedCard } from "@/components/HotelBookedCard";
import { FlightBookedCard } from "@/components/FlightBookedCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import api from "@/axiosConfig";
import toast from "react-hot-toast";

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
  const [hotelBookings, setHotelBookings] = useState([]);
  // const [flightBookings, setFlightBookings] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchHotelBookings = async () => {
      try {
        setFetchLoading(true);
        const res = await api.get("/api/users/bookings/hotels");
        setHotelBookings(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch hotel bookings", error);
        toast.error("Failed to load hotel bookings");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchHotelBookings();
  }, []);

  const handleHotelDelete = async (bookingId) => {
    try {
      await api.delete(`/api/users/bookings/hotel/${bookingId}`);
      toast.success("Hotel booking deleted");
      setHotelBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete booking");
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <span className="ml-4">Loading hotel data...</span>
      </div>
    );
  }

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">All Hotel Booking</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your hotel booking,or edit existing ones (coming soon).
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-6 space-y-4">
          <Tabs defaultValue="hotels" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="flights">Flights</TabsTrigger>
            </TabsList>
            <TabsContent value="hotels" className="space-y-4">
              {hotelBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-6">
                    <div className="text-muted-foreground text-center">
                      <p>No hotels booked yet.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                hotelBookings.map((booking) => (
                  <HotelBookedCard key={booking.id} booking={booking} onDelete={() => handleHotelDelete(booking.id)} />
                ))
              )}
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
