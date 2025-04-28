import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hotelSchema } from "./CreateHotelZodSchemaFrontend";
import api from "@/axiosConfig";
import toast from "react-hot-toast";

const amenitiesOptions = [
  { id: "parking", label: "Parking" },
  { id: "gym", label: "Gym" },
  { id: "pool", label: "Swimming Pool" },
  { id: "spa", label: "Spa" },
  { id: "restaurant", label: "Restaurant" },
  { id: "bar", label: "Bar" },
  { id: "wifi", label: "Free WiFi" },
  { id: "airport_shuttle", label: "Airport Shuttle" },
];

export default function HotelForm({ hotelId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [roomTypeIds, setRoomTypeIds] = useState([]);
  const isEditMode = !!hotelId;

  const form = useForm({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: "",
      description: "",
      city: "",
      amenities: [],
      state: "",
      country: "",
      rating: 3,
      address: "",
      latitude: "",
      longitude: "",
      roomTypes: [],
    },
  });

  useEffect(() => {
    if (hotelId) {
      const fetchHotelDetails = async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
          const response = await api.get(`/api/admin/hotels/${hotelId}`);
          const fetchedHotel = response.data.data;
          if (fetchedHotel) {
            if (fetchedHotel.images && fetchedHotel.images.length > 0) {
              setImagePreviewUrls(fetchedHotel.images);
            }

            if (fetchedHotel.roomTypes && fetchedHotel.roomTypes.length > 0) {
              const roomIds = fetchedHotel.roomTypes.map((room) => room.id);
              setRoomTypeIds(roomIds);
            }

            form.reset({
              name: fetchedHotel.name || "",
              description: fetchedHotel.description || "",
              amenities: fetchedHotel.amenities || [],
              city: fetchedHotel.location?.city || "",
              state: fetchedHotel.location?.state || "",
              country: fetchedHotel.location?.country || "",
              rating: fetchedHotel.rating || 3,
              address: fetchedHotel.location?.address || "",
              latitude: fetchedHotel.location?.coordinates?.latitude || "",
              longitude: fetchedHotel.location?.coordinates?.longitude || "",
            });
          }
        } catch (err) {
          console.error("Error fetching hotel:", err);
          setFetchError("Failed to load hotel data. Please try again.");
          toast.error("Failed to load hotel data. Please try again.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchHotelDetails();
    }
  }, [hotelId, form]);

  const handleRoomTypesChange = (e) => {
    const inputValue = e.target.value;
    const updatedRoomTypeIds = inputValue
      .split(",") // Split by comma
      .map((val) => val.trim());
    setRoomTypeIds(updatedRoomTypeIds);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();

      // Add text fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("rating", data.rating);

      // Add location data
      formData.append("location[city]", data.city);
      formData.append("location[state]", data.state);
      formData.append("location[country]", data.country);

      if (data.address) {
        formData.append("location[address]", data.address);
      }

      if (data.latitude) {
        formData.append("location[coordinates][latitude]", String(data.latitude));
      }

      if (data.longitude) {
        formData.append("location[coordinates][longitude]", String(data.longitude));
      }

      // Add amenities array
      data.amenities.forEach((amenity, index) => {
        formData.append(`amenities[${index}]`, amenity);
      });

      // Add room types array
      roomTypeIds.forEach((roomType, index) => {
        formData.append(`roomTypes[${index}]`, roomType);
      });

      // Add images
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Add existing image URLs if in edit mode and no new images selected
      if (isEditMode && imageFiles.length === 0 && imagePreviewUrls.length > 0) {
        imagePreviewUrls.forEach((url, index) => {
          formData.append(`existingImages[${index}]`, url);
        });
      }

      if (isEditMode) {
        await api.put(`/api/admin/hotels/${hotelId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("The hotel has been successfully updated");
      } else {
        await api.post("/api/admin/hotels", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("The hotel has been successfully created.");
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving hotel:", err);
      toast.success(err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} hotel. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    // Create preview URLs for the new files
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    // Remove from both arrays
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <span className="ml-4">Loading hotel data...</span>
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
            {/* Hotel Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hotel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter hotel description" className="min-h-[60px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location - City */}
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

            {/* Location - State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location - Country */}
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

            {/* Location - Address */}

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter hotel address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Location - Coordinates */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="Enter latitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="Enter longitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images - Handled separately from form state */}
            <div className="space-y-2">
              <FormLabel>Upload Images</FormLabel>
              <div>
                <input className="w-full rounded border border-gray-300 p-2" type="file" accept="image/*" multiple onChange={handleImageUpload} />
              </div>

              {/* Image Previews */}
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviewUrls.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt="Preview" className="h-20 w-20 rounded object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {imagePreviewUrls.length === 0 && <p className="text-sm text-gray-500">No images selected</p>}
            </div>
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="5" step="0.1" placeholder="Hotel rating (1-5)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amenities (Checkbox group) */}
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Amenities</FormLabel>
                    <FormDescription className="mt-1">Select the amenities available in this room type.</FormDescription>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {amenitiesOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          // Check if this amenity is included in the current value array (case-insensitive check)
                          const isChecked = field.value?.some((item) => item.toLowerCase() === option.id.toLowerCase());

                          return (
                            <FormItem className="flex flex-row items-start space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    let updatedAmenities;

                                    if (checked) {
                                      updatedAmenities = [...(field.value || []), option.id.toUpperCase()];
                                    } else {
                                      updatedAmenities = (field.value || []).filter((value) => value.toLowerCase() !== option.id.toLowerCase());
                                    }

                                    field.onChange(updatedAmenities);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Types */}
            <FormField
              name="roomTypes"
              render={(field) => (
                <FormItem>
                  <FormLabel>Room Types</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter room type IDs separated by commas"
                      value={roomTypeIds.join(", ")} // Use roomTypeIds as the controlled value
                      onChange={handleRoomTypesChange} // Handle change in the room type input
                      className="min-h-[100px]"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit / Cancel Buttons */}
            <div className="flex justify-between gap-2 md:justify-end">
              <Button type="button" className="font-semibold" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? (
                  <>
                    <span className="mr-2 animate-spin">⟳</span>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Hotel"
                ) : (
                  "Create Hotel"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
