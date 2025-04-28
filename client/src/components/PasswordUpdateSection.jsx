import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "@/axiosConfig";
import toast from "react-hot-toast";

export function PasswordSection() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);
    const updatePromise = new Promise((resolve, reject) => {
      api
        .put("/api/users/changepassword", { password })
        .then((response) => {
          if (response.status === 200) {
            setPassword("");
            setRepeatPassword("");
            setIsLoading(false);
            resolve("Password updated successfully!");
          } else {
            reject("Failed to update password!");
          }
        })
        .catch((error) => {
          reject(error.response?.data?.message || "An unexpected error occurred.");
        });
    });

    toast.promise(updatePromise, {
      loading: "Updating password...",
      success: "Password updated successfully! 🎉",
      error: (err) => err,
    });
  };

  return (
    <div className="mx-4 space-y-6 md:mx-0">
      <Card className="mx-4 space-y-4">
        <CardHeader>
          <CardTitle className="pt-4 pb-1 text-2xl font-bold tracking-tight">Change Password</CardTitle>
          <CardDescription className="text-muted-foreground">Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handlePasswordUpdate}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="repeatpassword">Repeat Password</Label>
                <Input id="repeatpassword" type="password" placeholder="Repeat new password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
              </div>
            </div>

            <Button type="submit" variant="primary" className="mx-auto my-6 w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
