import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import api from "../../../axiosConfig";

export default function AirportList({ onEditAirport }) {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteAirportId, setDeleteAirportId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchAirports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/admin/airports");
      setAirports(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching airports:", err);
      setError("Failed to load airports. Please try again.");
      toast.error("Failed to load airports. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAirports();
  }, [fetchAirports]);

  const handleDeleteClick = (airportId) => {
    setDeleteAirportId(airportId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteAirportId) return;

    try {
      await api.delete(`api/admin/airports/${deleteAirportId}`);
      setAirports((prevAirports) => prevAirports.filter((airport) => airport.id !== deleteAirportId));
      toast.success("The airport has been successfully deleted.");
    } catch (err) {
      console.error("Error deleting airport:", err);
      toast.error("Failed to delete airport. Please try again.");
    } finally {
      setShowDeleteDialog(false);
      setDeleteAirportId(null);
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
            <Button variant="outline" className="mt-4" onClick={fetchAirports}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (airports.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-muted-foreground text-center">
            <p>No airports found. Add your first airport to get started.</p>
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
              <TableHead>Airport Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {airports.map((airport) => (
              <TableRow key={airport.id}>
                <TableCell className="font-medium">{airport.name}</TableCell>
                <TableCell>{airport.code}</TableCell>
                <TableCell>{airport.city}</TableCell>
                <TableCell>{airport.country}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEditAirport(airport.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(airport.id)}>
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
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the airport and may affect related flights.</AlertDialogDescription>
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
