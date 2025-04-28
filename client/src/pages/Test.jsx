import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HotelSearchForm from "../components/HotelSearchForm";
import HotelCard from "../components/HotelCard";
import HotelFilters from "../components/HotelFilters";

// Mock data for hotels
const mockHotels = [
  {
    id: "h1",
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    description: "Experience luxury in the heart of Manhattan with stunning city views and world-class amenities.",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945", "https://images.unsplash.com/photo-1582719508461-905c673771fd", "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"],
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    stars: 5,
    amenities: ["Free WiFi", "Swimming Pool", "Fitness Center", "Spa", "Restaurant", "Room Service", "Free Parking", "Airport Shuttle"],
    rooms: [
      {
        id: "r1",
        name: "Deluxe King Room",
        description: "Spacious room with king-size bed and city view",
        price: 199,
        capacity: 2,
        amenities: ["King Bed", "City View", "Free WiFi", "Minibar", "Coffee Machine"],
        images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a", "https://images.unsplash.com/photo-1595576508898-0ad5c879a061"],
      },
      {
        id: "r2",
        name: "Executive Suite",
        description: "Luxurious suite with separate living area and panoramic views",
        price: 349,
        capacity: 2,
        amenities: ["King Bed", "Separate Living Area", "Panoramic View", "Free WiFi", "Minibar", "Coffee Machine", "Bathtub"],
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427", "https://images.unsplash.com/photo-1590490359683-658d3d23f972"],
      },
    ],
  },
  {
    id: "h2",
    name: "Oceanview Resort & Spa",
    location: "Miami, USA",
    description: "Beachfront resort with stunning ocean views, multiple pools, and a full-service spa.",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa", "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"],
    price: 299,
    originalPrice: 359,
    rating: 4.9,
    stars: 5,
    amenities: ["Free WiFi", "Swimming Pool", "Private Beach", "Fitness Center", "Spa", "Restaurant", "Room Service", "Free Parking"],
    rooms: [
      {
        id: "r3",
        name: "Ocean View Room",
        description: "Comfortable room with breathtaking ocean views",
        price: 299,
        capacity: 2,
        amenities: ["Queen Bed", "Ocean View", "Balcony", "Free WiFi", "Minibar"],
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f"],
      },
      {
        id: "r4",
        name: "Beachfront Suite",
        description: "Spacious suite with direct beach access and private terrace",
        price: 499,
        capacity: 3,
        amenities: ["King Bed", "Sofa Bed", "Beachfront", "Private Terrace", "Free WiFi", "Minibar", "Coffee Machine", "Bathtub"],
        images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6", "https://images.unsplash.com/photo-1566665797739-1674de7a421a"],
      },
    ],
  },
  {
    id: "h3",
    name: "City Lights Boutique Hotel",
    location: "Chicago, USA",
    description: "Stylish boutique hotel in downtown Chicago with unique design and personalized service.",
    images: ["https://images.unsplash.com/photo-1551632436-cbf8dd35adfa", "https://images.unsplash.com/photo-1611892440504-42a792e24d32", "https://images.unsplash.com/photo-1587985064135-0366536eab42"],
    price: 179,
    originalPrice: 209,
    rating: 4.6,
    stars: 4,
    amenities: ["Free WiFi", "Fitness Center", "Restaurant", "Bar", "Room Service", "Business Center"],
    rooms: [
      {
        id: "r5",
        name: "Standard Queen Room",
        description: "Cozy room with modern amenities in the heart of the city",
        price: 179,
        capacity: 2,
        amenities: ["Queen Bed", "City View", "Free WiFi", "Smart TV", "Coffee Machine"],
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9"],
      },
      {
        id: "r6",
        name: "Deluxe King Room",
        description: "Spacious room with premium amenities and city skyline views",
        price: 229,
        capacity: 2,
        amenities: ["King Bed", "Skyline View", "Free WiFi", "Smart TV", "Minibar", "Coffee Machine", "Work Desk"],
        images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39", "https://images.unsplash.com/photo-1566665797739-1674de7a421a"],
      },
    ],
  },
  {
    id: "h4",
    name: "Mountain View Lodge",
    location: "Denver, USA",
    description: "Rustic yet modern lodge with breathtaking mountain views and outdoor activities.",
    images: ["https://images.unsplash.com/photo-1517320964276-a002fa203177", "https://images.unsplash.com/photo-1542718610-a1d656d1884c", "https://images.unsplash.com/photo-1469796466635-455ede028aca"],
    price: 149,
    originalPrice: 189,
    rating: 4.7,
    stars: 4,
    amenities: ["Free WiFi", "Fireplace", "Restaurant", "Bar", "Hiking Trails", "Free Parking", "Pet Friendly"],
    rooms: [
      {
        id: "r7",
        name: "Mountain View Room",
        description: "Cozy room with stunning views of the Rocky Mountains",
        price: 149,
        capacity: 2,
        amenities: ["Queen Bed", "Mountain View", "Free WiFi", "Fireplace", "Coffee Machine"],
        images: ["https://images.unsplash.com/photo-1604709177225-055f99402ea3", "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa"],
      },
      {
        id: "r8",
        name: "Family Cabin",
        description: "Spacious cabin with multiple beds, perfect for families",
        price: 279,
        capacity: 4,
        amenities: ["King Bed", "Two Twin Beds", "Mountain View", "Private Deck", "Free WiFi", "Fireplace", "Kitchenette"],
        images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6", "https://images.unsplash.com/photo-1590490359683-658d3d23f972"],
      },
    ],
  },
  {
    id: "h5",
    name: "Riverside Luxury Suites",
    location: "San Antonio, USA",
    description: "Elegant all-suite hotel along the famous River Walk with spacious accommodations.",
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa", "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4", "https://images.unsplash.com/photo-1582719508461-905c673771fd"],
    price: 259,
    originalPrice: 299,
    rating: 4.8,
    stars: 5,
    amenities: ["Free WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "Room Service", "Business Center", "Concierge"],
    rooms: [
      {
        id: "r9",
        name: "Junior Suite",
        description: "Comfortable suite with separate living area and river views",
        price: 259,
        capacity: 2,
        amenities: ["King Bed", "River View", "Separate Living Area", "Free WiFi", "Minibar", "Coffee Machine"],
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427", "https://images.unsplash.com/photo-1566665797739-1674de7a421a"],
      },
      {
        id: "r10",
        name: "Executive River Suite",
        description: "Luxurious suite with panoramic river views and premium amenities",
        price: 399,
        capacity: 2,
        amenities: ["King Bed", "Panoramic River View", "Separate Living Area", "Free WiFi", "Minibar", "Coffee Machine", "Bathtub", "Work Desk"],
        images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461", "https://images.unsplash.com/photo-1590490359683-658d3d23f972"],
      },
    ],
  },
];

const HotelSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    stars: [],
    amenities: [],
  });

  // Get search params from URL
  const searchParams = {
    destination: queryParams.get("destination") || "",
    checkIn: queryParams.get("checkIn") || "",
    checkOut: queryParams.get("checkOut") || "",
    rooms: Number.parseInt(queryParams.get("rooms") || "1"),
    adults: Number.parseInt(queryParams.get("adults") || "2"),
    children: Number.parseInt(queryParams.get("children") || "0"),
  };

  useEffect(() => {
    // Fetch hotels based on search parameters
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/hotels/search?${new URLSearchParams(searchParams).toString()}`);
        // setHotels(response.data);
        // setFilteredHotels(response.data);

        // For now, use mock data
        // Simulate filtering by destination
        let filteredResults = [...mockHotels];
        if (searchParams.destination) {
          filteredResults = filteredResults.filter((hotel) => hotel.location.toLowerCase().includes(searchParams.destination.toLowerCase()));
        }

        setHotels(filteredResults);
        setFilteredHotels(filteredResults);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [location.search]);

  const handleSearch = (newSearchParams) => {
    // Convert search params to query string
    const queryString = new URLSearchParams(newSearchParams).toString();
    navigate(`/hotels/search?${queryString}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Apply filters
    let result = [...hotels];

    // Filter by price range
    result = result.filter((hotel) => hotel.price >= newFilters.minPrice && hotel.price <= newFilters.maxPrice);

    // Filter by star rating
    if (newFilters.stars.length > 0) {
      result = result.filter((hotel) => newFilters.stars.includes(hotel.stars));
    }

    // Filter by amenities
    if (newFilters.amenities.length > 0) {
      result = result.filter((hotel) => newFilters.amenities.every((amenity) => hotel.amenities.includes(amenity)));
    }

    setFilteredHotels(result);
  };

  const handleSortChange = (value) => {
    setSortBy(value);

    const sorted = [...filteredHotels];

    switch (value) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'recommended' - no specific sorting
        break;
    }

    setFilteredHotels(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Modify Search</h2>
          <HotelSearchForm onSearch={handleSearch} initialValues={searchParams} />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Filters */}
          <div className="w-full md:w-1/4">
            <HotelFilters hotels={hotels} onFilterChange={handleFilterChange} filters={filters} />
          </div>

          {/* Results */}
          <div className="w-full md:w-3/4">
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <h2 className="text-xl font-semibold">{searchParams.destination ? `Hotels in ${searchParams.destination}` : "All Hotels"}</h2>
                <div className="mt-2 flex items-center sm:mt-0">
                  <label htmlFor="sortBy" className="mr-2 text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select id="sortBy" className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-500">
                {searchParams.checkIn && searchParams.checkOut ? `${searchParams.checkIn} to ${searchParams.checkOut} • ` : ""}
                {searchParams.rooms} {searchParams.rooms === 1 ? "Room" : "Rooms"} • {searchParams.adults} {searchParams.adults === 1 ? "Adult" : "Adults"}
                {searchParams.children > 0 ? ` • ${searchParams.children} ${searchParams.children === 1 ? "Child" : "Children"}` : ""}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="h-8 w-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : filteredHotels.length > 0 ? (
                <div className="space-y-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No hotels found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;
