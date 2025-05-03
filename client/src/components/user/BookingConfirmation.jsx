import api from "@/axiosConfig";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const generateOrderId = (mongooseId) => {
  if (!mongooseId || mongooseId.length !== 24) {
    throw new Error("Invalid Mongoose ID");
  }
  return mongooseId.slice(-6).toUpperCase();
};

const BookingConfirmation = () => {
  const { type, id } = useParams(); // type: "hotel" | "flight"
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const endpoint = type === "hotel" ? `/api/booking/hotel/${id}` : `/api/booking/flight/${id}`;
        const response = await api.get(endpoint);
        setBookingDetails(response.data);
        setConfirmationNumber(`${type.toUpperCase()}-${generateOrderId(id)}`);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ${type} booking details:`, err);
        setError(`Failed to load ${type} booking details.`);
        setLoading(false);
      }
    };

    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      setConfirmationNumber(`${type.toUpperCase()}-${generateOrderId(id)}`);
      setLoading(false);
    } else {
      fetchBookingDetails();
    }
  }, [type, id, location.state]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <span className="ml-4">Loading {type} data...</span>
      </div>
    );
  }

  if (error) {
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
  console.log(bookingDetails);
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="bg-green-500 p-6 text-center">
            <svg className="mx-auto h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="mt-4 text-2xl font-bold text-white">Booking Confirmed!</h1>
            <p className="mt-1 text-white">Your {type} has been successfully booked.</p>
          </div>

          <div className="p-6">
            <div className="mb-6 border-b pb-4">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Confirmation Details</h2>
              <p className="text-gray-700">
                <span className="font-medium">Confirmation Number:</span> {confirmationNumber}
              </p>
            </div>

            {type === "hotel" ? (
              <>
                <div className="mb-6 border-b pb-4">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">Hotel Information</h2>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-gray-700 sm:grid-cols-2">
                    <p>
                      <span className="font-medium">Hotel:</span> {bookingDetails.hotelName}
                    </p>
                    <p>
                      <span className="font-medium">Room Type:</span> {bookingDetails.roomName}
                    </p>
                    <p>
                      <span className="font-medium">Check-in:</span> {bookingDetails.checkIn}
                    </p>
                    <p>
                      <span className="font-medium">Check-out:</span> {bookingDetails.checkOut}
                    </p>
                    <p>
                      <span className="font-medium">Guests:</span> {bookingDetails.guests}
                    </p>
                    <p>
                      <span className="font-medium">Nights:</span> {bookingDetails.nights}
                    </p>
                  </div>
                </div>

                <div className="mb-6 border-b pb-4">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">Guest Information</h2>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-gray-700 sm:grid-cols-2">
                    <p>
                      <span className="font-medium">Name:</span> {bookingDetails.firstName} {bookingDetails.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {bookingDetails.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {bookingDetails.phone}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 border-b pb-4">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">Flight Information</h2>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-gray-700 sm:grid-cols-2">
                    <p>
                      <span className="font-medium">Airline:</span> {bookingDetails.airline.name}
                    </p>
                    <p>
                      <span className="font-medium">Flight Number:</span> {bookingDetails.flightNumber}
                    </p>
                    <p>
                      <span className="font-medium">Route:</span> {bookingDetails.data.flight.departureAirport.city} to{" "}
                      {bookingDetails.data.flight.arrivalAirport.city}
                      {bookingDetails.arrivalCity}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(bookingDetails.data.flight.departureTime).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Departure Time:</span>{" "}
                      {new Date(bookingDetails.data.flight.departureTime)
                        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
                        .toUpperCase()}
                    </p>
                    <p>
                      <span className="font-medium">Class:</span> {bookingDetails.class}
                    </p>
                  </div>
                </div>

                <div className="mb-6 border-b pb-4">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">Passenger Information</h2>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-gray-700 sm:grid-cols-2">
                    <p>
                      <span className="font-medium">Passenger:</span> {bookingDetails.user.fullName}{" "}
                      {bookingDetails.passengers?.[0]?.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {bookingDetails.user.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {bookingDetails.user.phoneNumber}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="mb-4">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Payment Information</h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-gray-700 sm:grid-cols-2">
                <p>
                  <span className="font-medium">Total Amount:</span> ₹{bookingDetails.totalPrice}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span> Credit Card (ending in 1234)
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span className="font-medium text-green-600">Paid</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6">
            <div className="flex flex-col items-center justify-between sm:flex-row">
              <p className="mb-4 text-gray-700 sm:mb-0">A confirmation email has been sent to your email address.</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700"
                >
                  View All Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
