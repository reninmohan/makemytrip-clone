import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star } from "lucide-react";

function HotelFilters({ filters, setFilters }) {
  const { minPrice, maxPrice, selectedAmenities, selectedRating } = filters;

  const amenities = [
    { id: "parking", label: "Parking" },
    { id: "gym", label: "Gym" },
    { id: "pool", label: "Swimming Pool" },
    { id: "spa", label: "Spa" },
    { id: "restaurant", label: "Restaurant" },
    { id: "bar", label: "Bar" },
    { id: "wifi", label: "Free WiFi" },
    { id: "airport_shuttle", label: "Airport Shuttle" },
  ];

  const handleAmenityChange = (id) => {
    const updated = selectedAmenities.includes(id)
      ? selectedAmenities.filter((item) => item !== id)
      : [...selectedAmenities, id];
    setFilters((prev) => ({ ...prev, selectedAmenities: updated }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, selectedRating: prev.selectedRating === rating ? null : rating }));
  };

  const handlePriceChange = ([newMin, newMax]) => {
    setFilters((prev) => ({ ...prev, minPrice: newMin, maxPrice: newMax }));
  };

  const handleResetFilters = () => {
    setFilters({
      minPrice: 500,
      maxPrice: 50000,
      selectedAmenities: [],
      selectedRating: null,
    });
  };

  return (
    <div className="bg-card sticky top-20 mx-auto h-fit w-full space-y-6 rounded-lg border p-6 sm:mx-0 sm:w-[300px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleResetFilters}>
          Reset All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "rating", "amenities", "property"]}>
        {/* Price Filter */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="space-y-4">
              <Slider
                value={[minPrice, maxPrice]}
                min={0}
                max={100000}
                step={100}
                onValueChange={handlePriceChange}
                className="mt-2"
              />
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
                <div className="flex items-center overflow-hidden rounded-md border">
                  <span className="bg-muted text-muted-foreground h-full px-2">₹</span>
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, maxPrice])}
                    className="w-full border-0"
                  />
                </div>
                <span className="text-muted-foreground text-center">to</span>
                <div className="flex items-center overflow-hidden rounded-md border">
                  <span className="bg-muted text-muted-foreground px-2">₹</span>
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange([minPrice, parseInt(e.target.value) || 0])}
                    className="w-full border-0"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating" className="border-b">
          <AccordionTrigger className="py-3">Hotel Rating</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRating === rating}
                    onCheckedChange={() => handleRatingChange(rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="flex cursor-pointer items-center">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                      <Star key={i} className="text-muted-foreground h-4 w-4" />
                    ))}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Amenities Filter */}
        <AccordionItem value="amenities" className="border-b">
          <AccordionTrigger className="py-3">Amenities</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="flex flex-col gap-2">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={() => handleAmenityChange(amenity.id)}
                  />
                  <Label htmlFor={amenity.id} className="cursor-pointer">
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default HotelFilters;
