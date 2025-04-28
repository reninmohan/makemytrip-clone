import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../../ui/card";
import toast from "react-hot-toast";
import api from "@/axiosConfig";

const airportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(3, "Code must be exactly 3 characters").max(3, "Code must be exactly 3 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export default function AirportForm({ airportId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const isEditMode = !!airportId;

  const form = useForm({
    resolver: zodResolver(airportSchema),
    defaultValues: {
      name: "",
      code: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    if (airportId) {
      const fetchAirport = async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
          const response = await api.get(`/api/admin/airports/${airportId}`);
          const fetchAirport = response.data.data;
          form.reset({
            name: fetchAirport.name || "",
            code: fetchAirport.code || "",
            city: fetchAirport.city || "",
            country: fetchAirport.country || "",
          });
        } catch (err) {
          console.error("Error fetching airport:", err);
          setFetchError("Failed to load airport data. Please try again.");
          toast("Failed to load airport data. Please try again.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchAirport();
    }
  }, [airportId, form]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (isEditMode) {
        await api.put(`api/admin/airports/${airportId}`, data);
        toast.success("The airport has been successfully updated.");
      } else {
        await api.post("api/admin/airports", data);
        toast.success("The airport has been successfully created.");
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving airport:", err);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} airport. Please try again.`);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airport Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter airport name" {...field} />
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
                  <FormLabel>Airport Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter airport code (e.g., LAX)" maxLength={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 animate-spin">⟳</span>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Airport"
                ) : (
                  "Create Airport"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
