import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import api from "@/axiosConfig";

const flightSchema = z.object({
  flightNumber: z.string().min(2, "Flight number must be at least 2 characters"),
  airline: z.string().min(1, "Please select an airline"),
  departureAirport: z.string().min(1, "Please select a departure airport"),
  arrivalAirport: z.string().min(1, "Please select an arrival airport"),
  departureTime: z.string().min(1, "Please select a departure time"),
  arrivalTime: z.string().min(1, "Please select an arrival time"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  economyPrice: z.coerce.number().min(1, "Economy price must be at least ₹1"),
  businessPrice: z.coerce.number().min(1, "Business price must be at least ₹1"),
  firstClassPrice: z.coerce.number().min(1, "First class price must be at least ₹1"),
  economyAvailableSeats: z.coerce.number().min(0, "Economy seats must be at least 0"),
  businessAvailableSeats: z.coerce.number().min(0, "Business seats must be at least 0"),
  firstClassAvailableSeats: z.coerce.number().min(0, "First class seats must be at least 0"),
  isNonStop: z.boolean().default(true),
});

export default function FlightForm({ flightId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const isEditMode = !!flightId;

  const form = useForm({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      flightNumber: "",
      airline: "",
      departureAirport: "",
      arrivalAirport: "",
      departureTime: "",
      arrivalTime: "",
      duration: 90,
      economyPrice: 3500,
      businessPrice: 8000,
      firstClassPrice: 15000,
      economyAvailableSeats: 30,
      businessAvailableSeats: 20,
      firstClassAvailableSeats: 10,
      isNonStop: true,
    },
  });

  // Fetch airlines and airports for dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      setFetchLoading(true);
      try {
        const [airlinesRes, airportsRes] = await Promise.all([api.get("api/admin/airlines"), api.get("api/admin/airports")]);
        setAirlines(airlinesRes.data?.data || []);
        setAirports(airportsRes.data?.data || []);
      } catch (err) {
        console.error("Error fetching form data:", err);
        toast.error("Failed to load form data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (flightId) {
      const fetchFlight = async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
          const response = await api.get(`api/admin/flights/${flightId}`);
          const fetchedFlight = response?.data?.data;

          // Format dates for datetime-local input
          const formatDateForInput = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
          };

          form.reset({
            flightNumber: fetchedFlight.flightNumber,
            airline: fetchedFlight.airline._id || fetchedFlight.airline,
            departureAirport: fetchedFlight.departureAirport._id || fetchedFlight.departureAirport,
            arrivalAirport: fetchedFlight.arrivalAirport._id || fetchedFlight.arrivalAirport,
            departureTime: formatDateForInput(fetchedFlight.departureTime),
            arrivalTime: formatDateForInput(fetchedFlight.arrivalTime),
            duration: fetchedFlight.duration,
            economyPrice: fetchedFlight.price.economy || 4500,
            businessPrice: fetchedFlight.price.business || 8000,
            firstClassPrice: fetchedFlight.price.firstClass || 15000,
            economyAvailableSeats: fetchedFlight.availableSeats.economy || 30,
            businessAvailableSeats: fetchedFlight.availableSeats.business || 20,
            firstClassAvailableSeats: fetchedFlight.availableSeats.firstClass || 10,
            isNonStop: fetchedFlight.isNonStop,
          });
        } catch (err) {
          console.error("Error fetching flight:", err);
          setFetchError("Failed to load flight data. Please try again.");
          toast.error("Failed to load flight data. Please try again.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchFlight();
    }
  }, [flightId, form]);

  const onSubmit = async (data) => {
    // Validate that arrival airport is different from departure airport
    if (data.departureAirport === data.arrivalAirport) {
      form.setError("arrivalAirport", {
        type: "manual",
        message: "Arrival airport must be different from departure airport",
      });
      return;
    }

    // Validate that arrival time is after departure time
    const departureTime = new Date(data.departureTime);
    const arrivalTime = new Date(data.arrivalTime);
    if (arrivalTime <= departureTime) {
      form.setError("arrivalTime", {
        type: "manual",
        message: "Arrival time must be after departure time",
      });
      return;
    }

    // Transform data to match backend schema
    const formattedData = {
      flightNumber: data.flightNumber,
      airline: data.airline,
      departureAirport: data.departureAirport,
      arrivalAirport: data.arrivalAirport,
      departureTime: data.departureTime,
      arrivalTime: data.arrivalTime,
      duration: data.duration,
      price: {
        economy: data.economyPrice,
        business: data.businessPrice,
        firstClass: data.businessPrice,
      },
      availableSeats: {
        economy: data.economyAvailableSeats,
        business: data.businessAvailableSeats,
        firstClass: data.firstClassAvailableSeats,
      },
      isNonStop: data.isNonStop,
    };

    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`api/admin/flights/${flightId}`, formattedData);
        toast.success("The flight has been successfully updated.");
      } else {
        await api.post(`api/admin/flights`, formattedData);
        toast.success("The flight has been successfully created.");
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving flight:", err);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} flight. Please try again.`);
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="flightNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter flight number (e.g., DL1234)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="airline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airline</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select airline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {airlines.map((airline) => (
                          <SelectItem key={airline.id} value={airline.id}>
                            {airline.name} ({airline.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="departureAirport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Airport</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select departure airport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport.id} value={airport.id}>
                            {airport.code} - {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrivalAirport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival Airport</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select arrival airport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport.id} value={airport.id}>
                            {airport.code} - {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>Flight duration in minutes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isNonStop"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Non-Stop Flight</FormLabel>
                      <FormDescription>Check if this is a direct flight with no stops</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="economyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Economy Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstClassPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Class Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="economyAvailableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Economy Seats</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessAvailableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Seats</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstClassAvailableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Class Seats</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between gap-2 md:justify-end">
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
                  "Update Flight"
                ) : (
                  "Create Flight"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
