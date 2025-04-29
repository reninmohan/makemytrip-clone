import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, KeyRound, TicketCheck, Hotel, Bed, Building2, Map } from "lucide-react";
import { ProfileSection } from "@/components/ProfileUpdateSection";
import { PasswordSection } from "@/components/PasswordUpdateSection";
import { AdminAllBookingsSection } from "@/components/admin/AdminAllBookingSection";
import { HotelManagement } from "@/components/admin/hotel/HotelManagement";
import RoomTypeManagement from "@/components/admin/roomtype/RoomTypeManagement";
import { AirlineManagement } from "../components/admin/airline/AirlineManagement";
import { AirportManagement } from "../components/admin/airport/AirportManagement";
import { FlightManagement } from "../components/admin/flight/FlightManagement";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("hotels");

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid grid-cols-1 sm:gap-6 md:grid-cols-[240px_1fr] md:gap-8 lg:gap-12">
            <div className="hidden md:block">
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-2 py-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                    <AvatarFallback>
                      {currentUser?.fullName
                        ? currentUser.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{currentUser?.fullName || "Admin User"}</h2>
                    <p className="text-muted-foreground text-sm">{currentUser?.email || "admin@example.com"}</p>
                  </div>
                </div>
                <Separator />
                <nav className="ml-4 flex flex-col space-y-1">
                  <Button variant={activeTab === "hotels" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("hotels")}>
                    <Hotel className="mr-2 h-4 w-4" />
                    Hotels Management
                  </Button>
                  <Button variant={activeTab === "roomtypes" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("roomtypes")}>
                    <Bed className="mr-2 h-4 w-4" />
                    Room Types Management
                  </Button>
                  <Button variant={activeTab === "password" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("airline")}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Airline Management
                  </Button>
                  <Button variant={activeTab === "airports" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("airports")}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Airports Management
                  </Button>
                  <Button variant={activeTab === "flights" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("flights")}>
                    <Map className="mr-2 h-4 w-4" />
                    Flights Management
                  </Button>
                  <Button variant={activeTab === "allbooking" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("allbooking")}>
                    <TicketCheck className="mr-2 h-4 w-4" />
                    All Bookings
                  </Button>
                  <Button variant={activeTab === "profile" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant={activeTab === "password" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("password")}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Manage Password
                  </Button>
                </nav>
              </div>
            </div>

            <div>
              {/* For mobile view */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 md:hidden">
                <TabsList className="mb-4 grid w-full grid-cols-5">
                  <TabsTrigger value="hotels">Hotels</TabsTrigger>
                  <TabsTrigger value="roomtypes">Rooms</TabsTrigger>
                  <TabsTrigger value="allbooking">Bookings</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="flights">Flights</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="airline">Airline</TabsTrigger>
                  <TabsTrigger value="airports">Airports</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Main content sections */}
              <div>
                {activeTab === "profile" && <ProfileSection />}
                {activeTab === "allbooking" && <AdminAllBookingsSection />}
                {activeTab === "password" && <PasswordSection />}
                {activeTab === "hotels" && <HotelManagement />}
                {activeTab === "roomtypes" && <RoomTypeManagement />}
                {activeTab === "airline" && <AirlineManagement />}
                {activeTab === "airports" && <AirportManagement />}
                {activeTab === "flights" && <FlightManagement />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
