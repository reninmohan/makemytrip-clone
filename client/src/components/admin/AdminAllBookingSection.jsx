import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HotelBookedCard } from "../HotelBookedCard";
import { FlightBookedCard } from "../FlightBookedCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import api from "@/axiosConfig";
import toast from "react-hot-toast";

export function AdminAllBookingsSection() {
  const [hotelBookings, setHotelBookings] = useState([]);
  const [flightBookings, setFlightBookings] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setFetchLoading(true);

        const [hotelRes, flightRes] = await Promise.all([
          api.get("/api/admin/bookings/hotel"),
          api.get("/api/admin/bookings/flight"),
        ]);

        setHotelBookings(hotelRes.data.data || []);
        setFlightBookings(flightRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        toast.error("Failed to load bookings");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <span className="ml-4">Loading booking data...</span>
      </div>
    );
  }
  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">All Bookings</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your hotel and flight bookings.</CardDescription>
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
                hotelBookings.map((booking) => <HotelBookedCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>

            <TabsContent value="flights" className="space-y-4">
              {flightBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-6">
                    <div className="text-muted-foreground text-center">
                      <p>No flights booked yet.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                flightBookings.map((booking) => <FlightBookedCard key={booking._id} booking={booking} />)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
