// import { useNavigate } from "react-router-dom";
import FeaturedDestinations from "../components/FeaturedDestinations";
import SpecialOffers from "../components/SpecialOffers";
import Hero from "@/components/Hero";
const Homepage = () => {
  // const navigate = useNavigate();
  // const handleFlightSearch = (searchParams) => {
  //   // Convert search params to query string
  //   const queryString = new URLSearchParams(searchParams).toString();
  //   navigate(`/flights/search?${queryString}`);
  // };

  // const handleHotelSearch = (searchParams) => {
  //   // Convert search params to query string
  //   const queryString = new URLSearchParams(searchParams).toString();
  //   navigate(`/hotels/search?${queryString}`);
  // };

  return (
    <div className="mx-auto min-h-screen">
      <Hero />
      <FeaturedDestinations />
      <SpecialOffers />
    </div>
  );
};

export default Homepage;
