import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search, Plane } from "lucide-react";
import { format } from "date-fns";

function FlightSearch({ onSearch }) {
  const navigate = useNavigate();
  const [from, setForm] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(null);
  // const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState("1");
  const [travelClass, setTravelClass] = useState("economy");

  const handleSearch = (e) => {
    e.preventDefault();

    // Format dates for URL
    const departDateStr = departDate ? format(departDate, "yyyy-MM-dd") : "";

    onSearch({
      from,
      to,
      departDate,
      passengers,
      travelClass,
    });

    navigate(`/flights/search?origin=${origin}&destination=${to}&departDate=${departDateStr}&travelers=${passengers}&class=${travelClass}`);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="origin">From</Label>
          <div className="relative">
            <Plane className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input id="origin" placeholder="City or Airport" className="pl-9" value={from} onChange={(e) => setForm(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">To</Label>
          <div className="relative">
            <Plane className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 rotate-90" />
            <Input id="destination" placeholder="City or Airport" className="pl-9" value={to} onChange={(e) => setTo(e.target.value)} required />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="depart-date">Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-medium" id="depart-date">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? format(departDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={departDate} onSelect={setDepartDate} initialFocus disabled={(date) => date < new Date()} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="travelers">Travelers</Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger id="travelers">
              <SelectValue placeholder="Number of travelers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Adult</SelectItem>
              <SelectItem value="2">2 Adults</SelectItem>
              <SelectItem value="3">3 Adults</SelectItem>
              <SelectItem value="4">4 Adults</SelectItem>
              <SelectItem value="5">5+ Adults</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={travelClass} onValueChange={setTravelClass}>
            <SelectTrigger id="class">
              <SelectValue placeholder="Travel class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="firstClass">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="mb-2 w-full md:self-end" variant="primary">
          <Search className="mr-2 h-4 w-4" />
          Search Flights
        </Button>
      </div>
    </form>
  );
}

export default FlightSearch;
