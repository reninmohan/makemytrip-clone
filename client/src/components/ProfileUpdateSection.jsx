import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "@/axiosConfig";
import toast from "react-hot-toast";

export function ProfileSection() {
  const { currentUser, setCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    phoneNumber: currentUser?.phoneNumber || "",
    email: currentUser?.email || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put("/api/users/profile", formData);
      if (response.status === 200) {
        const updatedUser = { ...currentUser, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIsLoading(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">Personal Information</CardTitle>
          <CardDescription className="text-muted-foreground">Update your personal details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Deo" value={formData.fullName} required onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" placeholder="9136284588" required value={formData.phoneNumber} onChange={handleChange} />
              </div>
            </div>

            <Button type="submit" className="mt-5 mb-6 w-full" variant="primary" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
