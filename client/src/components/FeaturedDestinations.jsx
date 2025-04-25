import { Link } from "react-router-dom";

const FeaturedDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: "New York",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3JTIweW9ya3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "The city that never sleeps",
      hotels: 245,
      flights: 120,
    },
    {
      id: 2,
      name: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "The city of love",
      hotels: 189,
      flights: 95,
    },
    {
      id: 3,
      name: "Tokyo",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG9reW98ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "A blend of traditional and ultramodern",
      hotels: 210,
      flights: 85,
    },
    {
      id: 4,
      name: "Dubai",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Luxury shopping and ultramodern architecture",
      hotels: 178,
      flights: 75,
    },
  ];

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Popular Destinations</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">Discover our most popular destinations and plan your next adventure</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <div key={destination.id} className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:transform">
              <div className="relative h-48">
                <img src={destination.image || "/placeholder.svg"} alt={destination.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{destination.name}</h3>
                <p className="mt-2 text-gray-500">{destination.description}</p>
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <span>{destination.hotels} Hotels</span>
                  <span>{destination.flights} Flights</span>
                </div>
                <div className="mt-6 flex space-x-3">
                  <Link to={`/hotels?destination=${destination.name}`} className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700">
                    Hotels
                  </Link>
                  <Link to={`/flights?to=${destination.name}`} className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-center text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-purple-700">
                    Flights
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
