import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const airlines = [
  { id: "Indigo", label: "IndiGo" },
  { id: "Air India", label: "Air India" },
  { id: "Air India Express Ltd", label: "Air India Express" },
  { id: "Tata SIA Airlines Ltd", label: "Vistara" },
  { id: "SpiceJet", label: "SpiceJet" },
  { id: "Akasa Air", label: "Akasa Air" },
  { id: "Alliance Air Ltd", label: "Alliance Air" },
];

const timeOptions = [
  { id: "before6am", label: "Before 6AM", value: "before6am" },
  { id: "6amTo12pm", label: "6AM - 12PM", value: "6amTo12pm" },
  { id: "12pmTo6pm", label: "12PM - 6PM", value: "12pmTo6pm" },
  { id: "after6pm", label: "After 6PM", value: "after6pm" },
];

function FlightFilters({ filters, setFilters }) {
  const { minPrice, maxPrice, stops, departureTimes, arrivalTimes, selectedAirlines } = filters;

  const toggleSelection = (value, key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const handlePriceChange = ([newMin, newMax]) => {
    setFilters((prev) => ({ ...prev, minPrice: newMin, maxPrice: newMax }));
  };

  const handleReset = () => {
    setFilters({
      minPrice: 2000,
      maxPrice: 20000,
      stops: "any",
      departureTimes: [],
      arrivalTimes: [],
      selectedAirlines: [],
    });
  };

  return (
    <div className="bg-card sticky top-20 mx-auto h-fit w-full space-y-6 rounded-lg border p-6 sm:mx-0 sm:w-[300px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "stops", "airlines", "departure", "arrival"]}>
        {/* Price Filter */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="space-y-4">
              <Slider
                value={[minPrice, maxPrice]}
                min={2000}
                max={20000}
                step={500}
                onValueChange={handlePriceChange}
                className="mt-2"
              />
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
                <CurrencyInput value={minPrice} onChange={(val) => handlePriceChange([val, maxPrice])} />
                <span className="text-muted-foreground text-center">to</span>
                <CurrencyInput value={maxPrice} onChange={(val) => handlePriceChange([minPrice, val])} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stops Filter */}
        <RadioGroupSection
          title="Stops"
          value={stops}
          options={[
            { id: "stops-any", label: "Any", value: "any" },
            { id: "stops-nonstop", label: "Nonstop only", value: "nonStop" },
          ]}
          onChange={(val) => setFilters((prev) => ({ ...prev, stops: val }))}
        />

        {/* Airlines Filter */}
        <CheckboxSection
          title="Airlines"
          options={airlines}
          selected={selectedAirlines}
          onChange={(id) => toggleSelection(id, "selectedAirlines")}
        />

        {/* Departure & Arrival Time Filters */}
        <CheckboxSection
          title="Departure Time"
          options={timeOptions}
          selected={departureTimes}
          onChange={(val) => toggleSelection(val, "departureTimes")}
        />
        <CheckboxSection
          title="Arrival Time"
          options={timeOptions}
          selected={arrivalTimes}
          onChange={(val) => toggleSelection(val, "arrivalTimes")}
        />
      </Accordion>
    </div>
  );
}

export default FlightFilters;

// Subcomponents

const CurrencyInput = ({ value, onChange }) => (
  <div className="flex items-center overflow-hidden rounded-md border">
    <span className="bg-muted text-muted-foreground h-full px-2">₹</span>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      className="w-full border-0"
    />
  </div>
);

const RadioGroupSection = ({ title, value, options, onChange }) => (
  <AccordionItem value={title.toLowerCase()} className="border-b">
    <AccordionTrigger className="py-3">{title}</AccordionTrigger>
    <AccordionContent className="pt-1 pb-4">
      <RadioGroup value={value} onValueChange={onChange}>
        {options.map(({ id, label, value }) => (
          <div key={id} className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={id} />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    </AccordionContent>
  </AccordionItem>
);

const CheckboxSection = ({ title, options, selected, onChange }) => (
  <AccordionItem value={title.toLowerCase().replace(" ", "")} className="border-b">
    <AccordionTrigger className="py-3">{title}</AccordionTrigger>
    <AccordionContent className="pt-1 pb-4">
      {options.map(({ id, label, value }) => {
        const key = value || id;
        return (
          <div key={key} className="mb-2 flex items-center space-x-2">
            <Checkbox id={`${title}-${key}`} checked={selected.includes(key)} onCheckedChange={() => onChange(key)} />
            <Label htmlFor={`${title}-${key}`}>{label}</Label>
          </div>
        );
      })}
    </AccordionContent>
  </AccordionItem>
);
