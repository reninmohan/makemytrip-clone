import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function FlightBookedCard({ booking }) {
  return (
    <Card className="mx-2">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative h-40 overflow-hidden rounded-md md:h-auto md:w-1/4">
            <img src={booking.image || "/placeholder.svg?height=200&width=300"} alt="Flight" className="object-cover" />
            <Badge className="absolute top-2 left-2">Flight</Badge>
          </div>

          <div className="flex-1">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold">{booking.route}</h3>
                <p className="text-muted-foreground">{booking.airline}</p>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-sm font-medium">Departure</p>
                    <p className="text-sm">{booking.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Arrival</p>
                    <p className="text-sm">{booking.arrivalTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Passengers</p>
                    <p className="text-sm">{booking.passengers}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Class</p>
                    <p className="text-sm">{booking.class}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                  <div className="text-xl font-bold">₹{booking.price}</div>
                  <div className="text-muted-foreground text-sm">{booking.tripType}</div>
                </div>

                <div className="mt-4 flex gap-2 md:mt-0">
                  <Button variant="secondary" size="sm">
                    Modify
                  </Button>
                  <Button variant="secondary" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Booking ID:</span> {booking.bookingId}
              </div>
              <Button variant="link" size="sm" className="p-0">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
