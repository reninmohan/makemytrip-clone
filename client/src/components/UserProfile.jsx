import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Bell, Shield, User, Settings, LogOut, KeyRound, TicketCheck } from "lucide-react";

export function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // show loading toast
      const updatePromise = new Promise((resolve) => {
        setTimeout(() => {
          // simulate API call
          resolve("Profile updated successfully!");
        }, 1500);
      });

      await toast.promise(updatePromise, {
        loading: "Updating profile...",
        success: "Profile updated successfully! 🎉",
        error: "Failed to update profile! ❌",
      });

      // After successful update, you can do something if needed
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password == repeatPassword) {
      toast.success("Password updated successfully! ✅");
      return;
    }
    // ✅ If passwords match, proceed to send request here
    console.log("Passwords match, sending request...");
    // your API call goes here
  };

  return (
    <div className="grid grid-cols-1 gap-36 md:grid-cols-[240px_1fr]">
      <div className="hidden md:block">
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
              <AvatarFallback>RM</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-muted-foreground text-sm">john.doe@example.com</p>
            </div>
          </div>
          <Separator />
          <nav className="flex flex-col space-y-1">
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
          <Separator />
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
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

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>

            <Card className="mr-4">
              <CardHeader>
                <CardTitle className="pt-4 pb-1">Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" type="tel" placeholder="9136284588" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <CardFooter className="mt-5 mb-6 flex justify-end">
                    <Button type="submit" variant="primary">
                      Update Profile
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your upcoming and past bookings</p>
            </div>

            <Tabs defaultValue="hotels">
              <TabsList className="mb-6 grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="flights">Flight</TabsTrigger>
              </TabsList>

              <TabsContent value="hotels" className="space-y-4">
                <Card className="mr-4">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="relative h-40 overflow-hidden rounded-md md:h-auto md:w-1/4">
                        <img src="/placeholder.svg?height=200&width=300" alt="Hotel" className="object-cover" />
                        <Badge className="absolute top-2 left-2">Hotel</Badge>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col justify-between gap-4 md:flex-row">
                          <div>
                            <h3 className="text-xl font-semibold">Grand Plaza Hotel</h3>
                            <p className="text-muted-foreground">New York, USA</p>

                            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                              <div>
                                <p className="text-sm font-medium">Check-in</p>
                                <p className="text-sm">Jun 15, 2023</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Check-out</p>
                                <p className="text-sm">Jun 20, 2023</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Guests</p>
                                <p className="text-sm">2 Adults</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Room</p>
                                <p className="text-sm">Deluxe King</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between">
                            <div className="text-right">
                              <div className="text-xl font-bold">₹1,245</div>
                              <div className="text-muted-foreground text-sm">Total for 5 nights</div>
                            </div>

                            <div className="mt-4 flex gap-2 md:mt-0">
                              <Button variant="secondary" size="sm">
                                Modify
                              </Button>
                              <Button variant="secondary" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Booking ID:</span> HTL-12345678
                          </div>
                          <Button variant="link" size="sm" className="p-0">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flights" className="space-y-4">
                <Card className="mr-4">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="relative h-40 overflow-hidden rounded-md md:h-auto md:w-1/4">
                        <img src="/placeholder.svg?height=200&width=300" alt="Flight" className="object-cover" />
                        <Badge className="absolute top-2 left-2">Flight</Badge>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col justify-between gap-4 md:flex-row">
                          <div>
                            <h3 className="text-xl font-semibold">New York to Los Angeles</h3>
                            <p className="text-muted-foreground">Delta Airlines</p>

                            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                              <div>
                                <p className="text-sm font-medium">Departure</p>
                                <p className="text-sm">Jun 25, 2023 • 08:30 AM</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Arrival</p>
                                <p className="text-sm">Jun 25, 2023 • 11:45 AM</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Passengers</p>
                                <p className="text-sm">1 Adult</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Class</p>
                                <p className="text-sm">Economy</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between">
                            <div className="text-right">
                              <div className="text-xl font-bold">₹349</div>
                              <div className="text-muted-foreground text-sm">One-way ticket</div>
                            </div>

                            <div className="mt-4 flex gap-2 md:mt-0">
                              <Button variant="secondary" size="sm">
                                Modify
                              </Button>
                              <Button variant="secondary" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Booking ID:</span> FLT-87654321
                          </div>
                          <Button variant="link" size="sm" className="p-0">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === "password" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Password</h1>
              <p className="text-muted-foreground">Manage your password</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="pt-4 pb-1">Update your password</CardTitle>
                <CardDescription>Update your password easily</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePasswordUpdate}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input id="password" type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="repeatpassword">Repeat Password</Label>
                      <Input id="repeatpassword" type="password" placeholder="Repeat new password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                    </div>
                  </div>
                  <CardFooter className="mt-5 mb-6 flex justify-end">
                    <Button type="submit" variant="primary">
                      Update Profile
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "more" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">More Options</h1>
              <p className="text-muted-foreground">Additional account settings and options</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-auto items-start justify-start p-4 text-left" onClick={() => setActiveTab("payment")}>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    <span className="font-medium">Payment Methods</span>
                  </div>
                  <span className="text-muted-foreground mt-1 ml-7 text-sm">Manage your payment methods and billing information</span>
                </div>
              </Button>

              <Button variant="outline" className="h-auto items-start justify-start p-4 text-left" onClick={() => setActiveTab("notifications")}>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    <span className="font-medium">Notifications</span>
                  </div>
                  <span className="text-muted-foreground mt-1 ml-7 text-sm">Manage your notification preferences</span>
                </div>
              </Button>

              <Button variant="outline" className="h-auto items-start justify-start p-4 text-left" onClick={() => setActiveTab("security")}>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    <span className="font-medium">Security</span>
                  </div>
                  <span className="text-muted-foreground mt-1 ml-7 text-sm">Manage your account security and privacy settings</span>
                </div>
              </Button>

              <Button variant="outline" className="h-auto items-start justify-start p-4 text-left" onClick={() => setActiveTab("preferences")}>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    <span className="font-medium">Preferences</span>
                  </div>
                  <span className="text-muted-foreground mt-1 ml-7 text-sm">Customize your travel preferences and settings</span>
                </div>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600">
                  <span className="mr-2">🔄</span>
                  Reset account
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600">
                  <span className="mr-2">❌</span>
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
