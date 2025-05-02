import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import api from "../../../axiosConfig";

export default function FlightList({ onEditFlight }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteFlightId, setDeleteFlightId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/admin/flights");
      setFlights(response.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to load flights. Please try again.");
      toast.error("Failed to load flights. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleDeleteClick = (flightId) => {
    setDeleteFlightId(flightId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteFlightId) return;

    try {
      await api.delete(`api/admin/flights/${deleteFlightId}`);
      setFlights((prevFlights) => prevFlights.filter((flight) => flight.id !== deleteFlightId));
      toast.success("The flight has been successfully deleted.");
    } catch (err) {
      console.error("Error deleting flight:", err);
      toast.error("Failed to delete flight. Please try again.");
    } finally {
      setShowDeleteDialog(false);
      setDeleteFlightId(null);
    }
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-6">
          <div className="text-destructive text-center">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchFlights}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (flights.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-muted-foreground text-center">
            <p>No flights found. Add your first flight to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flight</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Economy</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>First Class</TableHead>
              <TableHead>Flight Id</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>
                  <div className="font-medium">{flight.flightNumber}</div>
                  <div className="text-muted-foreground text-sm">{flight.airline.name}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium">{flight.departureAirport.code}</div>
                    <div className="text-muted-foreground text-sm">to</div>
                    <div className="font-medium">{flight.arrivalAirport.code}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div>{formatDateTime(flight.departureTime)}</div>
                    <div className="text-muted-foreground text-sm">to</div>
                    <div>{formatDateTime(flight.arrivalTime)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {formatDuration(flight.duration)}
                    {flight.isNonStop ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        Non-stop
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
                        Connecting
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>₹ {flight.price.economy.toFixed(2)}</TableCell>
                <TableCell>₹ {flight.price.business.toFixed(2)}</TableCell>
                <TableCell>₹ {flight.price.firstClass.toFixed(2)}</TableCell>
                <TableCell>{flight.id}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEditFlight(flight.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(flight.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the flight and all associated data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
