import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search, MapPin } from "lucide-react";
import { format } from "date-fns";

function HotelSearch() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [guests, setGuests] = useState("1");
  const [rooms, setRooms] = useState("1");

  const handleSearch = (e) => {
    e.preventDefault();

    const checkInStr = checkIn ? format(checkIn, "yyyy-MM-dd") : "";
    const checkOutStr = checkOut ? format(checkOut, "yyyy-MM-dd") : "";

    if (!destination || !checkIn || !checkOut || !guests || !rooms) {
      return alert("Please fill out all fields.");
    }
    if (checkIn >= checkOut) {
      return alert("Check-out date must be after check-in date.");
    }

    navigate(
      `/hotels/search?destination=${encodeURIComponent(destination)}&checkInDate=${checkInStr}&checkOutDate=${checkOutStr}&capacity=${guests}&rooms=${rooms}`,
    );
  };

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <div className="relative">
            <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="destination"
              placeholder="Where are you going?"
              className="pl-9"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="check-in">Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="check-in">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-out">Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="check-out">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="guests">Guests</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger id="guests">
              <SelectValue placeholder="Number of guests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Guest</SelectItem>
              <SelectItem value="2">2 Guests</SelectItem>
              <SelectItem value="3">3 Guests</SelectItem>
              <SelectItem value="4">4 Guests</SelectItem>
              <SelectItem value="5">5 Guests</SelectItem>
              <SelectItem value="6">6+ Guests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rooms">Rooms</Label>
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger id="rooms">
              <SelectValue placeholder="Number of rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Room</SelectItem>
              <SelectItem value="2">2 Rooms</SelectItem>
              <SelectItem value="3">3 Rooms</SelectItem>
              <SelectItem value="4">4+ Rooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full md:self-end" variant="primary">
          <Search className="mr-2 h-4 w-4" />
          Search Hotels
        </Button>
      </div>
    </form>
  );
}

export default HotelSearch;
