import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const generateOrderId = (mongooseId) => {
  if (!mongooseId || mongooseId.length !== 24) {
    throw new Error("Invalid Mongoose ID");
  }
  return mongooseId.slice(-6).toUpperCase();
};

export function HotelBookedCard({ booking, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const confirmDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.(booking.id);
  };

  return (
    <Card className="mx-2">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative h-28 w-40 overflow-hidden rounded-md sm:h-32 sm:w-48 md:h-36 md:w-56">
            <img
              src={booking.roomType?.images?.[0] || "/placeholder.svg?height=200&width=300"}
              alt="Hotel"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold">{booking.hotel.name}</h3>
                <p className="text-muted-foreground">{booking.location}</p>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-sm font-medium">Check-in</p>
                    <p className="text-sm">{formatDate(booking.checkInDate)}</p>
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
                </div>

                <div className="mt-4 flex gap-2 md:mt-0">
                  <Button variant="secondary" size="sm">
                    Modify
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Booking ID:</span> {`HOTEL-${generateOrderId(booking.id)}`}
              </div>
              <Button variant="link" size="sm" className="p-0">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hotel booking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
