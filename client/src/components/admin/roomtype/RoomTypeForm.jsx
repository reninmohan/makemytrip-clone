import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { roomTypeSchema } from "./CreateRoomTypeZodSchema";
import api from "./../../../axiosConfig";

const amenitiesOptions = [
  { id: "wifi", label: "Free WiFi" },
  { id: "tv", label: "Smart TV" },
  { id: "ac", label: "Air Conditioning" },
  { id: "breakfast", label: "Breakfast Included" },
  { id: "parking", label: "Free Parking" },
  { id: "minibar", label: "Mini Bar" },
  { id: "safe", label: "In-room Safe" },
  { id: "bathtub", label: "Bathtub" },
];

export default function RoomTypeForm({ roomTypeId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const isEditMode = !!roomTypeId;

  const form = useForm({
    resolver: zodResolver(roomTypeSchema),

    defaultValues: {
      name: "",
      hotel: "",
      description: "",
      capacity: 2,
      pricePerNight: 1000,
      amenities: [],
      bedType: "",
      countInStock: 10,
    },
  });

  useEffect(() => {
    if (roomTypeId) {
      const fetchRoomTypeDetails = async () => {
        setFetchLoading(true);
        setFetchError(null);
        try {
          const response = await api.get(`/api/admin/roomtypes/${roomTypeId}`);
          const fetchedRoomType = response.data.data;

          if (fetchedRoomType) {
            if (fetchedRoomType.images && fetchedRoomType.images.length > 0) {
              setImagePreviewUrls(fetchedRoomType.images);
            }
          }

          form.reset({
            name: fetchedRoomType.name || "",
            description: fetchedRoomType.description || "",
            hotel: fetchedRoomType.hotel || "",
            capacity: fetchedRoomType.capacity || 1,
            pricePerNight: fetchedRoomType.pricePerNight || 1000,
            amenities: fetchedRoomType.amenities || [],

            bedType: fetchedRoomType.bedType || "",
            countInStock: fetchedRoomType.countInStock || 10,
          });
        } catch (err) {
          console.error("Error fetching room type:", err);
          setFetchError("Failed to load room type data. Please try again.");
          toast.error("Failed to load room type data. Please try again.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchRoomTypeDetails();
    }
  }, [roomTypeId, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("hotel", data.hotel);
      formData.append("capacity", data.capacity);
      formData.append("pricePerNight", data.pricePerNight);
      formData.append("bedType", data.bedType);
      formData.append("countInStock", data.countInStock);

      data.amenities.forEach((amenity, index) => {
        formData.append(`amenities[${index}]`, amenity);
      });

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (isEditMode && imageFiles.length === 0 && imagePreviewUrls.length > 0) {
        imagePreviewUrls.forEach((url, index) => {
          formData.append(`existingImages[${index}]`, url);
        });
      }

      if (isEditMode) {
        await api.put(`api/admin/roomtypes/${roomTypeId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("The room type has been successfully updated");
      } else {
        await api.post("/api/admin/roomtypes", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("The room type has been successfully created.");
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving room type:", err);
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} room type. Please try again.`);
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
      </div>
    );
  }

  if (fetchError) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-6">
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
        {/* Room Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter room type name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hotel (Multi Select or Select) */}
        <FormField
          control={form.control}
          name="hotel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel</FormLabel>
              <FormControl>
                <Input placeholder="Enter hotel IDs" {...field} />
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
                <Textarea placeholder="Enter room type description" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity (persons)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Per Night */}
        <FormField
          control={form.control}
          name="pricePerNight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Night (₹)</FormLabel>
              <FormControl>
                <Input type="number" min={1} step={1} {...field} max={1000000} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        {/* Bed Type */}
        <FormField
          control={form.control}
          name="bedType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter bed type (e.g., King, Queen)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Count In Stock */}
        <FormField
          control={form.control}
          name="countInStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Count</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} max={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Buttons */}
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
              "Update Room Type"
            ) : (
              "Create Room Type"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
