import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import api from "../../../axiosConfig";

export default function AirlineList({ onEditAirline }) {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteAirlineId, setDeleteAirlineId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchAirlines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/admin/airlines");
      setAirlines(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching airlines:", err);
      setError("Failed to load airlines. Please try again.");
      toast.error("Failed to load airlines. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAirlines();
  }, [fetchAirlines]);

  const handleDeleteClick = (airlineId) => {
    setDeleteAirlineId(airlineId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteAirlineId) return;

    try {
      await api.delete(`api/admin/airlines/${deleteAirlineId}`);
      setAirlines((prevAirlines) => prevAirlines.filter((airline) => airline.id !== deleteAirlineId));
      toast.success("The airline has been successfully deleted.");
    } catch (err) {
      console.error("Error deleting airline:", err);
      toast.error("Failed to delete airline. Please try again.");
    } finally {
      setShowDeleteDialog(false);
      setDeleteAirlineId(null);
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
            <Button variant="outline" className="mt-4" onClick={fetchAirlines}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (airlines.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground text-center">
            <p>No airlines found. Add your first airline to get started.</p>
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
              <TableHead>Airline</TableHead>
              <TableHead>Airline Name</TableHead>
              <TableHead>Airline Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {airlines.map((airline) => (
              <TableRow key={airline.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={airline.logo || "/placeholder.svg"} alt={airline.name} />
                    <AvatarFallback>{airline.code}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{airline.name}</TableCell>
                <TableCell>{airline.code}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEditAirline(airline.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(airline.id)}>
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
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the airline and may affect related flights.</AlertDialogDescription>
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
