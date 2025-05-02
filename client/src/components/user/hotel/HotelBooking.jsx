import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import api from "@/axiosConfig";
import toast from "react-hot-toast";

const HotelBooking = () => {
  const navigate = useNavigate();
  const { hotelId: roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkInDate = searchParams.get("checkInDate") || "";
  const checkOutDate = searchParams.get("checkOutDate") || "";
  const maxCapacity = searchParams.get("maxCapacity") || "1";
  const maxGuests = parseInt(maxCapacity, 10);

  const handleAdultsChange = (value) => {
    const total = value + children;
    if (total <= maxGuests) {
      setAdults(value);
    } else {
      toast.error(`Total guests cannot exceed ${maxGuests}`);
    }
  };

  const handleChildrenChange = (value) => {
    const total = adults + value;
    if (total <= maxGuests) {
      setChildren(value);
    } else {
      toast.error(`Total guests cannot exceed ${maxGuests}`);
    }
  };

  const parseDate = (dateStr, fallback) => {
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [checkIn, setCheckIn] = useState(() => parseDate(checkInDate, today));
  const [checkOut, setCheckOut] = useState(() => parseDate(checkOutDate, tomorrow));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [bookingDetails, setBookingDetails] = useState({
    firstName: currentUser?.fullName?.split(" ")[0] || "",
    lastName: currentUser?.fullName?.split(" ")[1] || "",
    email: currentUser?.email || "",
    phone: currentUser?.phoneNumber || "",
    checkIn: format(checkInDate, "yyyy-MM-dd") || format(today, "yyyy-MM-dd"),
    checkOut: format(checkOutDate, "yyyy-MM-dd") || format(tomorrow, "yyyy-MM-dd"),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`api/roomtypes/${roomId}`);
        setRoomType(response.data?.data);
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckInChange = (date) => {
    if (!date) return;
    setCheckIn(date);
    setBookingDetails((prev) => ({
      ...prev,
      checkIn: format(date, "yyyy-MM-dd"),
    }));
  };

  const handleCheckOutChange = (date) => {
    if (!date) return;
    setCheckOut(date);
    setBookingDetails((prev) => ({
      ...prev,
      checkOut: format(date, "yyyy-MM-dd"),
    }));
  };

  const calculateNights = () => {
    const inDate = new Date(bookingDetails.checkIn);
    const outDate = new Date(bookingDetails.checkOut);
    const diffTime = Math.abs(outDate - inDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!roomType) return 0;
    return Number(roomType.pricePerNight) * calculateNights();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (checkIn >= checkOut) {
      return alert("Check-out date must be after check-in date.");
    }

    try {
      const response = await api.post("/api/booking/hotel", {
        roomType: roomType.id,
        hotel: roomType.hotel,
        checkInDate: format(checkIn, "yyyy-MM-dd"),
        checkOutDate: format(checkOut, "yyyy-MM-dd"),
        guests: {
          adults: adults,
          children: children,
        },
      });

      toast.success("Hotel booked successfully.");
      console.log(response);

      navigate(`/booking/confirmation/hotel/${response.data.data.id}`, {
        state: {
          bookingDetails: {
            ...bookingDetails,
            roomName: roomType.name,
            hotelName: response.data?.data.hotel.name,
            guests: adults + children,
            nights: calculateNights(),
            totalPrice: calculateTotal(),
          },
        },
      });
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.error("Hotel booking failed");
      setError("Failed to create booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !roomType) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-500">{error || "Room not found"}</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-5xl p-4">
        <h1 className="mb-4 ml-2 text-3xl font-bold">Complete Your Booking</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" className="mb-1 ml-1">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={bookingDetails.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="mb-1 ml-1">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={bookingDetails.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="mb-1 ml-1">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={bookingDetails.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="mb-1 ml-1">
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={bookingDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          onSelect={handleCheckInChange}
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
                          onSelect={handleCheckOutChange}
                          initialFocus
                          disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adults" className="mb-1 ml-1">
                        Number of Adults
                      </Label>
                      <Input
                        type="number"
                        id="adults"
                        min="1"
                        value={adults}
                        onChange={(e) => handleAdultsChange(parseInt(e.target.value, 10))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="children" className="mb-1 ml-1">
                        Number of Children
                      </Label>
                      <Input
                        type="number"
                        id="children"
                        min="0"
                        value={children}
                        onChange={(e) => handleChildrenChange(parseInt(e.target.value, 10))}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                </Button>
              </CardContent>
            </Card>
          </form>

          <Card className="pt-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={roomType?.images?.[0] || "/fallback-image.jpg"}
                alt={roomType.name}
                className="h-48 w-full rounded-lg object-cover"
              />

              <div>
                <h3 className="text-lg font-semibold">{roomType.name}</h3>
                <p className="text-sm text-gray-500">{roomType.hotelName}</p>
              </div>

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{bookingDetails.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{bookingDetails.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">{adults + children}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-medium">{calculateNights()}</span>
                </div>
              </div>

              <div className="text-md flex justify-between border-t pt-4 font-semibold">
                <span>Total Price:</span>
                <span>₹ {calculateTotal()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;
