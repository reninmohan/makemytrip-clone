import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/axiosConfig";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FlightDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState("economy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!flightId) {
        setError("Invalid flight ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/flights/${flightId}`);
        if (!response.data?.data) {
          throw new Error("No flight data received");
        }
        setFlight(response.data.data);
      } catch (err) {
        console.error("Error fetching flight details:", err);
        setError(err.response?.data?.message || "Failed to load flight details");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  const handleBookFlight = async (e) => {
    e.preventDefault();
    if (!flight?.id || !selectedClass) {
      toast.error("Please select a valid flight class");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/booking/flight", {
        flight: flightId,
        seatClass: selectedClass,
      });

      const { data } = response.data;
      const bookingDetails = {
        user: data.user,
        flightNumber: data.flight.flightNumber,
        airline: data.flight.airline,
        departureCity: data.flight.departureCity,
        arrivalCity: data.flight.arrivalCity,
        departureDate: data.flight.departureDate,
        departureTime: data.flight.departureTime,
        class: data.seatClass,
        status: data.status,
        paymentStatus: data.paymentStatus,
        bookingDate: data.bookingDate,
        totalPrice: data.totalPrice,
        data,
      };
      toast.success("Flight booked successfully.");

      // Navigate to confirmation page
      navigate(`/booking/confirmation/flight/${data._id}`, {
        state: {
          bookingDetails,
        },
      });
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <span className="ml-4">Loading flight booking...</span>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive text-center">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Flight Summary */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {flight.departureAirport.city} to {flight.arrivalAirport.city}
              </h1>
              <p className="mt-1 text-gray-600">
                {new Date(flight.departureTime).toLocaleDateString()} • {flight.airline?.name} • Flight{" "}
                {flight.flightNumber}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {flight.isNonStop ? "Nonstop" : "Connecting"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="text-2xl font-bold">
                {new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-lg font-medium">
                {flight.departureAirport?.code} - {flight.departureAirport?.city}
              </p>
              <p className="text-sm text-gray-500">{new Date(flight.departureTime).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 text-sm text-gray-500">
                {`${Math.floor(flight.duration / 60)}Hr ${flight.duration % 60}m`}
              </p>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200"></div>
                </div>
                <div className="relative flex justify-between">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{flight.isNonStop ? "Nonstop" : " Connecting"}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Arrival</p>
              <p className="text-2xl font-bold">
                {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-lg font-medium">
                {flight.arrivalAirport?.code} - {flight.arrivalAirport?.city}
              </p>
              <p className="text-sm text-gray-500">{new Date(flight.arrivalTime).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 border-b pb-2 text-xl font-semibold text-gray-900">Flight Details</h2>
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Airline:</span>
                <span className="text-gray-900">{flight.airline.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Flight Number:</span>
                <span className="text-gray-900">{flight.flightNumber}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Duration:</span>
                <span className="text-gray-900">
                  {`${Math.floor(flight.duration / 60)}Hr ${flight.duration % 60}m`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Select Your Seat Class</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {["economy", "business", "firstClass"].map((classType) => {
              const isSelected = selectedClass === classType;
              const price = flight.price?.[classType];
              const seats = flight.availableSeats?.[classType];

              if (!price) return null;

              return (
                <div
                  key={classType}
                  onClick={() => setSelectedClass(classType)}
                  className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-semibold text-gray-900 capitalize">
                      {classType === "business" && "💼 "}
                      {classType === "economy" && "💵 "}
                      {classType === "firstClass" && "👑 "}
                      {classType}
                    </div>
                    <input
                      type="radio"
                      name="class"
                      checked={isSelected}
                      onChange={() => setSelectedClass(classType)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <p className="mb-1 text-2xl font-bold text-blue-600">₹{price}</p>
                  <p className="mb-3 text-sm text-gray-500">per passenger</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Available Seats:</span> {seats || "N/A"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Summary (without taxes) */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Booking Summary</h2>
          <div className="mb-4 border-b pb-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Base Fare ({selectedClass})</span>
              <span className="font-medium">₹{flight.price?.[selectedClass] || 0}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">Total</p>
              <p className="text-sm text-gray-500">per passenger</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{flight.price?.[selectedClass] || 0}</p>
          </div>
          <button
            onClick={handleBookFlight}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700"
            disabled={isSubmitting}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
