import { Link } from "react-router-dom";

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Summer Getaway",
      description: "Get up to 30% off on beach resorts",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2h8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      discount: "30% OFF",
      validUntil: "Valid until August 31, 2023",
    },
    {
      id: 2,
      title: "City Breaks",
      description: "Explore major cities with our exclusive packages",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      discount: "From $299",
      validUntil: "Limited time offer",
    },
    {
      id: 3,
      title: "Last Minute Deals",
      description: "Grab our last-minute flight offers",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWlycGxhbmV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      discount: "Up to 25% OFF",
      validUntil: "Book within 72 hours",
    },
  ];

  return (
    <section className="bg-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Special Offers</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">Take advantage of our limited-time deals and save on your next trip</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.id} className="overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:transform">
              <div className="relative">
                <img src={offer.image || "/placeholder.svg"} alt={offer.title} className="h-48 w-full object-cover" />
                <div className="absolute top-0 right-0 rounded-bl-lg bg-red-600 px-3 py-1 font-bold text-white">{offer.discount}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{offer.title}</h3>
                <p className="mt-2 text-gray-500">{offer.description}</p>
                <p className="mt-4 text-sm text-gray-600">{offer.validUntil}</p>
                <Link to="/hotels" className="mt-6 block w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700">
                  View Offer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
