import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomTypeList from "./RoomTypeList";
import RoomTypeForm from "./RoomTypeForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoomTypeManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [editRoomTypeId, setEditRoomTypeId] = useState(null);

  const handleEditRoomType = (roomTypeId) => {
    setEditRoomTypeId(roomTypeId);
    setActiveTab("edit");
  };

  const handleCreateSuccess = () => {
    setActiveTab("list");
  };

  const handleEditSuccess = () => {
    setEditRoomTypeId(null);
    setActiveTab("list");
  };

  const handleCancelEdit = () => {
    setEditRoomTypeId(null);
    setActiveTab("list");
  };

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">Room Types Management</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your roomtype, create new ones, or edit existing ones.</CardDescription>
        </CardHeader>
        <CardContent className="mb-6 space-y-4">
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="list">Room Type List</TabsTrigger>
                <TabsTrigger value="create">Create Room Type</TabsTrigger>
                {editRoomTypeId && <TabsTrigger value="edit">Edit Room Type</TabsTrigger>}
              </TabsList>

              <TabsContent value="list" className="space-y-4 pt-4">
                <RoomTypeList onEditRoomType={handleEditRoomType} />
              </TabsContent>

              <TabsContent value="create" className="space-y-4 pt-4">
                <RoomTypeForm onSuccess={handleCreateSuccess} onCancel={() => setActiveTab("list")} />
              </TabsContent>

              <TabsContent value="edit" className="space-y-4 pt-4">
                {editRoomTypeId && <RoomTypeForm roomTypeId={editRoomTypeId} onSuccess={handleEditSuccess} onCancel={handleCancelEdit} />}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
