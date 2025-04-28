import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "@/components/ProfileUpdateSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserBookingSection } from "./UserBookingSection";
import { User, KeyRound, TicketCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PasswordSection } from "./PasswordUpdateSection";

export function UserProfile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="grid grid-cols-1 sm:gap-6 md:grid-cols-[240px_1fr] md:gap-32">
      <div className="hidden md:block">
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
              <AvatarFallback>{currentUser?.fullName.split(" ")[0].split("")[0] + currentUser?.fullName.split(" ")[1].split("")[0] || "User"}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{currentUser?.fullName || "@email"}</h2>
              <p className="text-muted-foreground text-sm">{currentUser?.email || "@user"}</p>
            </div>
          </div>
          <Separator />
          <nav className="ml-4 flex flex-col space-y-1">
            <Button variant={activeTab === "profile" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant={activeTab === "bookings" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("bookings")}>
              <TicketCheck className="mr-2 h-4 w-4" />
              My Bookings
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
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Profile card */}
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "bookings" && <UserBookingSection />}
        {activeTab === "password" && <PasswordSection />}
        {activeTab === "more" && (
          <div className="mx-4 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">More Options</h1>
              <p className="text-muted-foreground">Additional account settings and options</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-auto items-start justify-start p-4 text-left" onClick={() => setActiveTab("password")}>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <KeyRound className="mr-2 h-4 w-4" />
                    <span className="font-medium">Manage Password</span>
                  </div>
                  <span className="text-muted-foreground mt-1 ml-7 text-sm">Update your password easily</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
