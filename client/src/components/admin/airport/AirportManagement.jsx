import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AirportList from "./AirportList";
import AirportForm from "./AirportForm";

export function AirportManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [editAirportId, setEditAirportId] = useState(null);

  const handleEditAirport = (airportId) => {
    setEditAirportId(airportId);
    setActiveTab("edit");
  };

  const handleCreateSuccess = () => {
    setActiveTab("list");
  };

  const handleEditSuccess = () => {
    setEditAirportId(null);
    setActiveTab("list");
  };

  const handleCancelEdit = () => {
    setEditAirportId(null);
    setActiveTab("list");
  };

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">Airports Management</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your Airports , create new ones, or edit existing ones.</CardDescription>
        </CardHeader>
        <CardContent className="mb-6 space-y-4">
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="list">Airport List</TabsTrigger>
                <TabsTrigger value="create">Create Airport</TabsTrigger>
                {editAirportId && <TabsTrigger value="edit">Edit Airport</TabsTrigger>}
              </TabsList>

              <TabsContent value="list" className="space-y-4 pt-4">
                <AirportList onEditAirport={handleEditAirport} />
              </TabsContent>

              <TabsContent value="create" className="space-y-4 pt-4">
                <AirportForm onSuccess={handleCreateSuccess} onCancel={() => setActiveTab("list")} />
              </TabsContent>

              <TabsContent value="edit" className="space-y-4 pt-4">
                {editAirportId && <AirportForm airportId={editAirportId} onSuccess={handleEditSuccess} onCancel={handleCancelEdit} />}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
