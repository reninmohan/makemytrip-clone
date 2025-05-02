"use client";

import api from "@/axiosConfig";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const generateOrderId = (mongooseId) => {
  if (!mongooseId || mongooseId.length !== 24) {
    throw new Error("Invalid Mongoose ID");
  }
  return mongooseId.slice(-6).toUpperCase();
};

const BookingConfirmation = () => {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);

      setConfirmationNumber(`${type.toUpperCase()}-${generateOrderId(id)}`);
      setLoading(false);
    } else {
      const fetchBookingDetails = async () => {
        try {
          const response = await api.get(`/api/booking/hotel`);
          setBookingDetails(response.data);
          setConfirmationNumber(response.data.confirmationNumber);
          setLoading(false);
        } catch (err) {
          console.error(`Error fetching ${type} booking details:`, err);
          setError(`Failed to load ${type} booking details`);
          setLoading(false);
        }
      };
      fetchBookingDetails();

      navigate("/");
    }
  }, [type, id, location.state, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <svg
          className="h-12 w-12 animate-spin text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mt-4 text-xl font-bold text-gray-900">{error || "Booking not found"}</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

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
            <div className="mb-4 border-b pb-4">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Confirmation Details</h2>
              <p className="text-gray-700">
                <span className="font-medium">Confirmation Number:</span> {confirmationNumber}
              </p>
            </div>
            {type === "hotel" ? (
              <div>
                <div className="mb-4 border-b pb-4">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">Hotel Information</h2>
                  <p className="text-gray-700">
                    <span className="font-medium">Hotel:</span> {bookingDetails.hotelName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Room Type:</span> {bookingDetails.roomName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Check-in:</span> {bookingDetails.checkIn}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Check-out:</span> {bookingDetails.checkOut}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Guests:</span> {bookingDetails.guests}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Nights:</span> {bookingDetails.nights}
                  </p>
                </div>

                <div className="mb-4 border-b pb-4">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">Guest Information</h2>
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span> {bookingDetails.firstName} {bookingDetails.lastName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {bookingDetails.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {bookingDetails.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 border-b pb-4">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">Flight Information</h2>
                  <p className="text-gray-700">
                    <span className="font-medium">Airline:</span> {bookingDetails.airline}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Flight Number:</span> {bookingDetails.flightNumber}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Route:</span> {bookingDetails.departureCity} to{" "}
                    {bookingDetails.arrivalCity}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Date:</span> {bookingDetails.departureDate}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Departure Time:</span> {bookingDetails.departureTime}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Class:</span>{" "}
                    {bookingDetails.class.charAt(0).toUpperCase() + bookingDetails.class.slice(1)}
                  </p>
                </div>

                <div className="mb-4 border-b pb-4">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">Passenger Information</h2>
                  {bookingDetails.passengers?.map((passenger, index) => (
                    <div key={index} className={index > 0 ? "mt-4" : ""}>
                      <p className="text-gray-700">
                        <span className="font-medium">Passenger {index + 1}:</span> {passenger.firstName}{" "}
                        {passenger.lastName}
                      </p>
                      {index === 0 && (
                        <>
                          <p className="text-gray-700">
                            <span className="font-medium">Email:</span> {passenger.email}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Phone:</span> {passenger.phone}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Payment Information</h2>
              <p className="text-gray-700">
                <span className="font-medium">Total Amount:</span>₹{bookingDetails.totalPrice}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Payment Method:</span> Credit Card (ending in 1234)
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Payment Status:</span>{" "}
                <span className="font-medium text-green-600">Paid</span>
              </p>
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
