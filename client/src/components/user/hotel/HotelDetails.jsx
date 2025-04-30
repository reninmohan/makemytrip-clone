import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dumbbell, Bath, Wifi, Car, WavesLadder, Check, Utensils, Wine, Bus, Wind, Lock, EggFried, Beer, BathIcon, Tv } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "@/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HotelDetails = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch hotel details
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`api/hotels/${hotelId}`);
        setHotel(response.data?.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hotel details:", err);
        setError("Failed to load hotel details");
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);
  const handleBookRoom = (roomId) => {
    navigate(`/booking/hotel/book/${roomId}`);
  };

  const imageSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const roomImageSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const amenityIcons = {
    PARKING: <Car className="h-4 w-4" />,
    GYM: <Dumbbell className="h-4 w-4" />,
    POOL: <WavesLadder className="h-4 w-4" />,
    SPA: <Bath className="h-4 w-4" />,
    RESTAURANT: <Utensils className="h-4 w-4" />,
    BAR: <Wine className="h-4 w-4" />,
    WIFI: <Wifi className="h-4 w-4" />,
    AIRPORT_SHUTTLE: <Bus className="h-4 w-4" />,
    AC: <Wind className="h-4 w-4" />,
    SAFE: <Lock className="h-4 w-4" />,
    BREAKFAST: <Utensils className="h-4 w-4" />,
    MINIBAR: <Beer className="h-4 w-4" />,
    BATHTUB: <BathIcon className="h-4 w-4" />,
    TV: <Tv className="h-4 w-4" />,
  };

  const getAmenityIcon = (id) => {
    return amenityIcons[id] || <Check className="h-4 w-4" />;
  };

  // Compute the lowest price among the room types for a price summary
  const lowestRoomPrice = hotel && hotel.roomTypes && hotel.roomTypes.length > 0 ? Math.min(...hotel.roomTypes.map((room) => room.pricePerNight)) : null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <span className="ml-4">Loading hotel data...</span>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive text-center">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
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
        {/* Hotel Images Slider */}
        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
          <Slider {...imageSettings} className="hotel-image-slider">
            {hotel.images.map((image, index) => (
              <div key={index} className="relative h-96">
                <img src={image || "/placeholder.svg"} alt={`${hotel.name} - ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>

        {/* Hotel Details */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                  <p className="mt-1 text-gray-600">
                    {hotel.location.city}, {hotel.location.state}, {hotel.location.country}
                  </p>
                </div>
                <div className="flex items-center rounded-lg bg-blue-100 px-3 py-1 text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">{hotel.rating}</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Description</h2>
                <p className="text-gray-700">{hotel.description}</p>
              </div>

              <div className="mt-6">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Amenities</h2>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="bg-muted flex w-30 items-center gap-1 rounded-full px-2 py-1 text-xs">
                      {getAmenityIcon(amenity)}
                      <span> {amenity} </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="h-fit rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Price Summary</h2>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-gray-700">Starting from</span>
              <span className="text-2xl font-bold text-blue-600">{lowestRoomPrice ? `₹${lowestRoomPrice}` : "--"}</span>
            </div>
            <p className="mb-4 text-sm text-gray-500">Price Per Night</p>
            <button
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById("rooms").offsetTop - 100,
                  behavior: "smooth",
                })
              }
              className="w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700"
            >
              View Rooms
            </button>
          </div>
        </div>

        <div id="rooms" className="mb-8">
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Available Rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {hotel.roomTypes.map((room) => (
                <Card key={room.id} className="border-b pb-8 shadow-none last:border-b-0 last:pb-0">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="md:col-span-1">
                        <Slider {...roomImageSettings} className="room-image-slider">
                          {room.images.map((image, index) => (
                            <div key={index} className="relative h-64">
                              <img src={image || "/placeholder.svg"} alt={`${room.name} - ${index + 1}`} className="h-full w-full rounded-lg object-cover" />
                            </div>
                          ))}
                        </Slider>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                            <p className="mt-1 text-gray-700">{room.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">₹{room.pricePerNight}</p>
                            <p className="text-sm text-gray-500">per night</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="mb-2 font-medium text-gray-900">Room Amenities</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {room.amenities.map((amenity, index) => (
                              <div key={index} className="flex w-20 items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <p className="text-gray-700">
                            <span className="font-medium">Max Occupancy:</span> {room.capacity} Guests
                          </p>
                          <Button onClick={() => handleBookRoom(room.id)} variant="primary">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
