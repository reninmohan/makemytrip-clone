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

const generateOrderId = (mongooseId) => {
  if (!mongooseId || mongooseId.length !== 24) {
    throw new Error("Invalid Mongoose ID");
  }
  return mongooseId.slice(-6).toUpperCase();
};

export function FlightBookedCard({ booking, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const confirmDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.(booking._id);
  };
  return (
    <Card className="mx-2">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative h-40 overflow-hidden rounded-md md:h-auto md:w-1/4">
            <img
              src={booking.flight?.airline?.logo || "/placeholder.svg?height=200&width=300"}
              alt="Flight"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold">{booking.route}</h3>
                <p className="text-muted-foreground">{booking.airline}</p>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-sm font-medium">Departure</p>
                    <p className="text-sm">
                      {new Date(booking.flight?.departureTime)
                        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
                        .toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Arrival</p>
                    <p className="text-sm">
                      {new Date(booking.flight?.arrivalTime)
                        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
                        .toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Passengers</p>
                    <p className="text-sm">{booking.user?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Seat Class</p>
                    <p className="text-sm">{booking.seatClass}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                  <div className="text-xl font-bold">₹{booking.totalPrice}</div>
                  <div className="text-muted-foreground text-sm">{booking.tripType}</div>
                </div>

                <div className="mt-4 flex gap-2 md:mt-0">
                  <Button variant="secondary" size="sm">
                    Modify
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Booking ID:</span> FLIGHT- {generateOrderId(booking._id)}
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
