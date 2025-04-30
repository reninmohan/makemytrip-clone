import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function objectIdToOrderId(objectId) {
  return BigInt("0x" + objectId)
    .toString(36)
    .toUpperCase();
}

export function HotelBookedCard({ booking }) {
  return (
    <Card className="mx-2">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative h-40 overflow-hidden rounded-md md:h-auto md:w-1/4">
            <img src={booking.hotel.images[0] || "/placeholder.svg?height=200&width=300"} alt="Hotel" className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold">{booking.hotel.name}</h3>
                <p className="text-muted-foreground">{booking.location}</p>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-sm font-medium">Check-in</p>
                    <p className="text-sm"> {formatDate(booking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-out</p>
                    <p className="text-sm">{formatDate(booking.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Guests</p>
                    <p className="text-sm">{booking.guests.adults + booking.guests.children}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Room</p>
                    <p className="text-sm">{booking.roomType.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                  <div className="text-xl font-bold">₹{booking.totalPrice}</div>
                  {/* <div className="text-muted-foreground text-sm">Total for {booking.nights} nights</div> */}
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
                <span className="font-medium">Booking ID:</span> {objectIdToOrderId(booking.id)}
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
