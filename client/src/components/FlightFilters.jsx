import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function FlightFilters() {
  const [priceRange, setPriceRange] = useState([2000, 100000]);
  const [minPrice, setMinPrice] = useState(2000);
  const [maxPrice, setMaxPrice] = useState(100000);

  const [stops, setStops] = useState("any");
  const [departureTimes, setDepartureTimes] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  const airlines = [
    { id: "delta", label: "Delta Airlines" },
    { id: "united", label: "United Airlines" },
    { id: "american", label: "American Airlines" },
    { id: "southwest", label: "Southwest Airlines" },
    { id: "jetblue", label: "JetBlue Airways" },
    { id: "spirit", label: "Spirit Airlines" },
    { id: "frontier", label: "Frontier Airlines" },
    { id: "alaska", label: "Alaska Airlines" },
  ];

  const timeOptions = [
    { id: "before6am", label: "Before 6AM", value: "before6am" },
    { id: "6amTo12pm", label: "6AM - 12PM", value: "6amTo12pm" },
    { id: "12pmTo6pm", label: "12PM - 6PM", value: "12pmTo6pm" },
    { id: "after6pm", label: "After 6PM", value: "after6pm" },
  ];

  const handleDepartureTimeChange = (value) => {
    setDepartureTimes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleArrivalTimeChange = (value) => {
    setArrivalTimes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleAirlineChange = (id) => {
    setSelectedAirlines((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleSliderChange = (values) => {
    setPriceRange(values);
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setMinPrice(value);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setMaxPrice(value);
    setPriceRange([priceRange[0], value]);
  };

  return (
    <div className="bg-card sticky top-20 h-fit space-y-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm">
          Reset All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "stops", "airlines", "departure", "arrival"]}>
        {/* Price Range */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="space-y-4">
              <Slider value={priceRange} min={2000} max={100000} step={500} onValueChange={handleSliderChange} className="mt-2" />
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
                <div className="flex items-center overflow-hidden rounded-md border">
                  <span className="bg-muted text-muted-foreground h-full px-2">₹</span>
                  <Input type="number" value={minPrice} onChange={handleMinPriceChange} className="w-full border-0" />
                </div>
                <span className="text-muted-foreground text-center">to</span>
                <div className="flex items-center overflow-hidden rounded-md border">
                  <span className="bg-muted text-muted-foreground px-2">₹</span>
                  <Input type="number" value={maxPrice} onChange={handleMaxPriceChange} className="w-full border-0" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stops */}
        <AccordionItem value="stops" className="border-b">
          <AccordionTrigger className="py-3">Stops</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <RadioGroup value={stops} onValueChange={setStops}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="stops-any" />
                <Label htmlFor="stops-any">Any</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nonstop" id="stops-nonstop" />
                <Label htmlFor="stops-nonstop">Nonstop only</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Airlines */}
        <AccordionItem value="airlines" className="border-b">
          <AccordionTrigger className="py-3">Airlines</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="grid grid-cols-1 gap-2">
              {airlines.map((airline) => (
                <div key={airline.id} className="flex items-center space-x-2">
                  <Checkbox id={airline.id} checked={selectedAirlines.includes(airline.id)} onCheckedChange={() => handleAirlineChange(airline.id)} />
                  <Label htmlFor={airline.id} className="cursor-pointer">
                    {airline.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Departure Time */}
        <AccordionItem value="departure" className="border-b">
          <AccordionTrigger className="py-3">Departure Time</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="grid grid-cols-1 gap-2">
              {timeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox id={`departure-${option.id}`} checked={departureTimes.includes(option.value)} onCheckedChange={() => handleDepartureTimeChange(option.value)} />
                  <Label htmlFor={`departure-${option.id}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Arrival Time */}
        <AccordionItem value="arrival" className="border-b">
          <AccordionTrigger className="py-3">Arrival Time</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="grid grid-cols-1 gap-2">
              {timeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox id={`arrival-${option.id}`} checked={arrivalTimes.includes(option.value)} onCheckedChange={() => handleArrivalTimeChange(option.value)} />
                  <Label htmlFor={`arrival-${option.id}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="primary"
        className="w-full"
        onClick={() =>
          console.log({
            priceRange,
            minPrice,
            maxPrice,
            stops,
            selectedAirlines,
            departureTimes,
            arrivalTimes,
          })
        }
      >
        Apply Filters
      </Button>
    </div>
  );
}

export default FlightFilters;
