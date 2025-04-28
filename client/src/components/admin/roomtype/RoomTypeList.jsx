import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import api from "../../../axiosConfig";

export default function RoomTypeList({ onEditRoomType }) {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteRoomTypeId, setDeleteRoomTypeId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("api/admin/roomtypes");
      setRoomTypes(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching room types:", err);
      setError("Failed to load room types. Please try again.");
      toast.error("Failed to load room types. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const handleDeleteClick = (roomTypeId) => {
    setDeleteRoomTypeId(roomTypeId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteRoomTypeId) return;

    try {
      await api.delete(`/api/admin/roomtypes/${deleteRoomTypeId}`);
      setRoomTypes((prevRoomTypes) => prevRoomTypes.filter((roomType) => roomType.id !== deleteRoomTypeId));
      toast.success("The room type has been successfully deleted.");
    } catch (err) {
      console.error("Error deleting room type:", err);
      toast.error("Failed to delete room type. Please try again.");
    } finally {
      setShowDeleteDialog(false);
      setDeleteRoomTypeId(null);
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
        <CardContent className="pt-6">
          <div className="text-destructive text-center">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchRoomTypes}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (roomTypes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground text-center">
            <p>No room types found. Create your first room type to get started.</p>
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
              <TableHead>Name</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price/Night</TableHead>
              <TableHead>Hotel Id</TableHead>
              <TableHead>RoomType ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypes.map((roomType) => (
              <TableRow key={roomType.id}>
                <TableCell className="font-medium">{roomType.name}</TableCell>
                <TableCell className="font-medium">{roomType.hotel.name}</TableCell>
                <TableCell>{roomType.capacity} persons</TableCell>
                <TableCell>₹ {roomType.pricePerNight.toFixed(2)}</TableCell>
                <TableCell>{roomType.hotel.id}</TableCell>
                <TableCell>{roomType.id}</TableCell>
                <TableCell>{new Date(roomType.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEditRoomType(roomType.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(roomType.id)}>
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
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the room type data.</AlertDialogDescription>
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
