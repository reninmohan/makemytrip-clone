import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FlightList from "./FlightList";
import FlightForm from "./FlightForm";

export function FlightManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [editFlightId, setEditFlightId] = useState(null);

  const handleEditFlight = (flightId) => {
    setEditFlightId(flightId);
    setActiveTab("edit");
  };

  const handleCreateSuccess = () => {
    setActiveTab("list");
  };

  const handleEditSuccess = () => {
    setEditFlightId(null);
    setActiveTab("list");
  };

  const handleCancelEdit = () => {
    setEditFlightId(null);
    setActiveTab("list");
  };

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">Flights Management</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your flights, create new ones, or edit existing ones.</CardDescription>
        </CardHeader>
        <CardContent className="mb-6 space-y-4">
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="list">Flight List</TabsTrigger>
                <TabsTrigger value="create">Add Flight</TabsTrigger>
                {editFlightId && <TabsTrigger value="edit">Edit Flight</TabsTrigger>}
              </TabsList>

              <TabsContent value="list" className="space-y-4 pt-4">
                <FlightList onEditFlight={handleEditFlight} />
              </TabsContent>

              <TabsContent value="create" className="space-y-4 pt-4">
                <FlightForm onSuccess={handleCreateSuccess} onCancel={() => setActiveTab("list")} />
              </TabsContent>

              <TabsContent value="edit" className="space-y-4 pt-4">
                {editFlightId && <FlightForm flightId={editFlightId} onSuccess={handleEditSuccess} onCancel={handleCancelEdit} />}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
