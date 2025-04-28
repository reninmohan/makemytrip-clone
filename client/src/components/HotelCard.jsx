import { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HotelCard = ({ hotel }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentImageIndex(index),
  };

  // Calculate discount percentage if there's a discounted price
  const discountPercentage = hotel.originalPrice ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <Slider {...settings} className="hotel-image-slider">
          {hotel.images.map((image, index) => (
            <div key={index} className="relative h-64">
              <img src={image || "/placeholder.svg"} alt={`${hotel.name} - ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </Slider>
        {discountPercentage > 0 && <div className="absolute top-0 right-0 rounded-bl-lg bg-red-600 px-3 py-1 font-bold text-white">{discountPercentage}% OFF</div>}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{hotel.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{hotel.location}</p>
          </div>
          <div className="flex items-center rounded-lg bg-blue-100 px-2 py-1 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold">{hotel.rating}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 4 && <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">+{hotel.amenities.length - 4} more</span>}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-gray-500">Per night</p>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-blue-600">${hotel.price}</span>
              {hotel.originalPrice && <span className="ml-2 text-sm text-gray-500 line-through">${hotel.originalPrice}</span>}
            </div>
          </div>
          <Link to={`/hotels/${hotel.id}`} className="mt-4 rounded-md bg-blue-600 px-6 py-2 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700 sm:mt-0">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
