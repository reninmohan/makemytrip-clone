import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

function PopularDestinations() {
  const destinations = [
    {
      id: 1,
      name: "New York",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3JTIweW9ya3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "The city that never sleeps",
      price: "From $499",
    },
    {
      id: 2,
      name: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "The city of love",
      price: "From $699",
    },
    {
      id: 3,
      name: "Tokyo",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG9reW98ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "A blend of traditional and ultramodern",
      price: "From $799",
    },
    {
      id: 4,
      name: "Dubai",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Luxury shopping and ultramodern architecture",
      price: "From $599",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-10 flex flex-col items-start justify-between md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl">Explore our most popular destinations and find your next adventure</p>
        </div>
        <Button variant="link" asChild className="mt-4 hidden items-center md:mt-0 md:flex">
          <Link href="/destinations">
            View all destinations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => (
          <Link href={destination.link} key={destination.name} className="group">
            <Card className="min-h-[22rem] overflow-hidden border-0 p-0 shadow-md transition-all duration-200 hover:shadow-lg">
              {/* Make sure no padding here */}
              <div className="relative h-72 w-full overflow-hidden">
                <img src={destination.image || "/placeholder.svg"} alt={destination.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <CardContent className="p-4 pt-2">
                <h3 className="text-lg font-semibold">{destination.name}</h3>
                <p className="text-muted-foreground text-sm">{destination.price}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Button variant="link" asChild className="mx-auto mt-6 flex items-center md:hidden">
        <Link href="/destinations">
          View all destinations
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}

export default PopularDestinations;
