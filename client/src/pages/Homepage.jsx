import FeaturedDestinations from "../components/FeaturedDestinations";
import SpecialOffers from "../components/SpecialOffers";
import Hero from "../components/Hero";

const Homepage = () => {
  return (
    <div className="mx-auto min-h-screen">
      <Hero />
      <FeaturedDestinations />
      <SpecialOffers />
    </div>
  );
};

export default Homepage;
