import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import api from "../../../axiosConfig";

export default function HotelList({ onEditHotel }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteHotelId, setDeleteHotelId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("api/admin/hotels");
      setHotels(response.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to load hotels. Please try again.");
      toast.error("Failed to load hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleDeleteClick = (hotelId) => {
    setDeleteHotelId(hotelId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteHotelId) return;

    try {
      await api.delete(`/api/admin/hotels/${deleteHotelId}`);
      setHotels((prevHotels) => prevHotels.filter((hotel) => hotel.id !== deleteHotelId));

      toast.success("The hotel has been successfully deleted.");
    } catch (err) {
      console.error("Error deleting hotel:", err);
      toast.error("Failed to delete hotel. Please try again.");
    } finally {
      setShowDeleteDialog(false);
      setDeleteHotelId(null);
    }
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
            <Button variant="outline" className="my-4" onClick={fetchHotels}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hotels.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-muted-foreground text-center">
            <p>No hotels found. Create your first hotel to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left">Location</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-left">Hotel ID</TableHead>
              <TableHead className="text-left">Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell className="text-left font-medium">{hotel.name}</TableCell>
                <TableCell className="text-left">{`${hotel.location.city}, ${hotel.location.state}, ${hotel.location.country}`}</TableCell>
                <TableCell className="text-center">{hotel.rating}</TableCell>
                <TableCell className="text-left">{hotel.id}</TableCell>
                <TableCell className="text-left">{new Date(hotel.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEditHotel(hotel.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(hotel.id)}>
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
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the hotel data.</AlertDialogDescription>
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
