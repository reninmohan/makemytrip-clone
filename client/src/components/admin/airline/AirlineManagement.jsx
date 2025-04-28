import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AirlineList from "./AirlineList";
import AirlineForm from "./AirlineForm";

export function AirlineManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [editAirlineId, setEditAirlineId] = useState(null);

  const handleEditAirline = (airlineId) => {
    setEditAirlineId(airlineId);
    setActiveTab("edit");
  };

  const handleCreateSuccess = () => {
    setActiveTab("list");
  };

  const handleEditSuccess = () => {
    setEditAirlineId(null);
    setActiveTab("list");
  };

  const handleCancelEdit = () => {
    setEditAirlineId(null);
    setActiveTab("list");
  };

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">Airlines Management</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your airline, create new ones, or edit existing ones.</CardDescription>
        </CardHeader>
        <CardContent className="mb-6 space-y-4">
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="list">Airline List</TabsTrigger>
                <TabsTrigger value="create">Create Airline</TabsTrigger>
                {editAirlineId && <TabsTrigger value="edit">Edit Airline</TabsTrigger>}
              </TabsList>
              <TabsContent value="list" className="space-y-4 pt-4">
                <AirlineList onEditAirline={handleEditAirline} />
              </TabsContent>
              <TabsContent value="create" className="space-y-4 pt-4">
                <AirlineForm onSuccess={handleCreateSuccess} onCancel={() => setActiveTab("list")} />
              </TabsContent>
              <TabsContent value="edit" className="space-y-4 pt-4">
                {editAirlineId && <AirlineForm airlineId={editAirlineId} onSuccess={handleEditSuccess} onCancel={handleCancelEdit} />}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
