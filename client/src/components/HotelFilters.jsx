import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star } from "lucide-react";

function HotelFilters() {
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRating, setSelectedRating] = useState(4); // default 4 star
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(["hotel"]); // default selected

  const amenities = [
    { id: "wifi", label: "Free WiFi" },
    { id: "breakfast", label: "Free Breakfast" },
    { id: "parking", label: "Free Parking" },
    { id: "pool", label: "Swimming Pool" },
    { id: "gym", label: "Fitness Center" },
    { id: "spa", label: "Spa" },
    { id: "ac", label: "Air Conditioning" },
    { id: "restaurant", label: "Restaurant" },
    { id: "pets", label: "Pet Friendly" },
    { id: "roomService", label: "Room Service" },
  ];

  const propertyTypes = [{ id: "hotel", label: "Hotel" }];

  const handleAmenityChange = (id) => {
    setSelectedAmenities((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleRatingChange = (rating) => {
    setSelectedRating((prev) => (prev === rating ? null : rating));
  };

  const handlePropertyTypeChange = (id) => {
    setSelectedPropertyTypes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handlePriceChange = ([newMin, newMax]) => {
    setMinPrice(newMin);
    setMaxPrice(newMax);
  };

  const handleResetFilters = () => {
    setMinPrice(50);
    setMaxPrice(500);
    setSelectedAmenities([]);
    setSelectedRating(4);
    setSelectedPropertyTypes(["hotel"]);
  };

  return (
    <div className="bg-card sticky top-20 h-fit w-full space-y-6 rounded-lg border p-6 sm:w-[300px]">
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
              <Slider value={[minPrice, maxPrice]} min={0} max={200000} step={10} onValueChange={handlePriceChange} className="mt-2" />
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
                <div className="flex items-center overflow-hidden rounded-md border">
                  <span className="bg-muted text-muted-foreground h-full px-2">₹</span>
                  <Input type="number" value={minPrice} onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)} className="w-full border-0" />
                </div>
                <span className="text-muted-foreground text-center">to</span>
                <div className="flex items-center overflow-hidden rounded-md border">
                  <span className="bg-muted text-muted-foreground px-2">₹</span>
                  <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)} className="w-full border-0" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating" className="border-b">
          <AccordionTrigger className="py-3">Star Rating</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} checked={selectedRating === rating} onCheckedChange={() => handleRatingChange(rating)} />
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
                  <Checkbox id={amenity.id} checked={selectedAmenities.includes(amenity.id)} onCheckedChange={() => handleAmenityChange(amenity.id)} />
                  <Label htmlFor={amenity.id} className="cursor-pointer">
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Property Type Filter */}
        <AccordionItem value="property" className="border-b">
          <AccordionTrigger className="py-3">Property Type</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="flex flex-col gap-2">
              {propertyTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox id={type.id} checked={selectedPropertyTypes.includes(type.id)} onCheckedChange={() => handlePropertyTypeChange(type.id)} />
                  <Label htmlFor={type.id} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" variant="primary">
        Apply Filters
      </Button>
    </div>
  );
}

export default HotelFilters;
