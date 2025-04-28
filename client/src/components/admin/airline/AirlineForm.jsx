import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/axiosConfig";

const airlineSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(3, "Code cannot exceed 3 characters"),
});

export default function AirlineForm({ airlineId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const isEditMode = Boolean(airlineId);

  const form = useForm({
    resolver: zodResolver(airlineSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  useEffect(() => {
    if (airlineId) {
      const fetchAirline = async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
          const response = await api.get(`/api/admin/airlines/${airlineId}`);
          const fetchAirline = response.data.data;
          if (fetchAirline.images) {
            setLogoPreview(fetchAirline.logo);
          }
          form.reset({
            name: fetchAirline.name || "",
            code: fetchAirline.code || "",
          });
        } catch (error) {
          console.error(error);
          setFetchError("Failed to load airline data.");
          toast.error("Failed to load airline data.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchAirline();
    }
  }, [airlineId, form]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (isEditMode) {
        await api.put(`/api/admin/airlines/${airlineId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Airline updated successfully.");
      } else {
        await api.post("/api/admin/airlines", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Airline created successfully.");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} airline.`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive text-center">
            <p>{fetchError}</p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
            <div className="mb-6 flex flex-col items-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage src={logoPreview || ""} alt="Airline Logo" />
                <AvatarFallback>{form.watch("code") || "Logo"}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <label htmlFor="logo-upload" className="text-primary-foreground hover:bg-primary/90 flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2">
                  <Upload className="h-4 w-4" />
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </label>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} name="logo" />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter airline name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airline Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter airline code (e.g., DL)" maxLength={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? (
                  <>
                    <span className="mr-2 animate-spin">⟳</span>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Airline"
                ) : (
                  "Create Airline"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
