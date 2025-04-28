import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelList from "../hotel/HotelList";
import HotelForm from "../hotel/HotelForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HotelManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [editHotelId, setEditHotelId] = useState(null);

  const handleEditHotel = (hotelId) => {
    setEditHotelId(hotelId);
    setActiveTab("edit");
  };

  const handleCreateSuccess = () => {
    setActiveTab("list");
  };

  const handleEditSuccess = () => {
    setEditHotelId(null);
    setActiveTab("list");
  };

  const handleCancelEdit = () => {
    setEditHotelId(null);
    setActiveTab("list");
  };

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">Hotels Management</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your hotel listings, create new ones, or edit existing ones.</CardDescription>
        </CardHeader>
        <CardContent className="mb-6 space-y-4">
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="list">Hotel List</TabsTrigger>
                <TabsTrigger value="create">Create Hotel</TabsTrigger>
                {editHotelId && <TabsTrigger value="edit">Edit Hotel</TabsTrigger>}
              </TabsList>

              <TabsContent value="list" className="space-y-4 pt-4">
                <HotelList onEditHotel={handleEditHotel} />
              </TabsContent>

              <TabsContent value="create" className="space-y-4 pt-4">
                <HotelForm onSuccess={handleCreateSuccess} onCancel={() => setActiveTab("list")} />
              </TabsContent>

              <TabsContent value="edit" className="space-y-4 pt-4">
                {editHotelId && <HotelForm hotelId={editHotelId} onSuccess={handleEditSuccess} onCancel={handleCancelEdit} />}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
