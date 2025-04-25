"use client"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Search, Plane } from "lucide-react"
import { format } from "date-fns"

export function FlightSearch() {
  const router = useRouter()
  const [tripType, setTripType] = useState("roundTrip")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departDate, setDepartDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [travelers, setTravelers] = useState("1")
  const [travelClass, setTravelClass] = useState("economy")

  const handleSearch = (e) => {
    e.preventDefault()

    // Format dates for URL
    const departDateStr = departDate ? format(departDate, "yyyy-MM-dd") : ""
    const returnDateStr = returnDate ? format(returnDate, "yyyy-MM-dd") : ""

    // Navigate to search results with query params
    router.push(
      `/flights/search?tripType=${tripType}&origin=${origin}&destination=${destination}&departDate=${departDateStr}&returnDate=${returnDateStr}&travelers=${travelers}&class=${travelClass}`,
    )
  }

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="space-y-4">
        <RadioGroup defaultValue="roundTrip" value={tripType} onValueChange={setTripType} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="roundTrip" id="roundTrip" />
            <Label htmlFor="roundTrip">Round Trip</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oneWay" id="oneWay" />
            <Label htmlFor="oneWay">One Way</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiCity" id="multiCity" />
            <Label htmlFor="multiCity">Multi-City</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="origin">From</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="origin"
              placeholder="City or Airport"
              className="pl-9"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">To</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90" />
            <Input
              id="destination"
              placeholder="City or Airport"
              className="pl-9"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="depart-date">Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" id="depart-date">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? format(departDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {tripType === "roundTrip" && (
          <div className="space-y-2">
            <Label htmlFor="return-date">Return Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="return-date">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  disabled={(date) => date < new Date() || (departDate ? date <= departDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="travelers">Travelers</Label>
          <Select value={travelers} onValueChange={setTravelers}>
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
              <SelectItem value="premiumEconomy">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="firstClass">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full md:self-end">
          <Search className="mr-2 h-4 w-4" />
          Search Flights
        </Button>
      </div>
    </form>
  )
}
