import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

function PopularDestinations() {
  const destinations = [
    {
      id: 1,
      name: "Jaipur",
      image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=60&w=500&fit=crop",
      description: "The Pink City of royal heritage",
      price: "From ₹29,900",
    },
    {
      id: 2,
      name: "Goa",
      image: "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?q=60&w=500&fit=crop",
      description: "Beaches, nightlife, and vibrant culture",
      price: "From ₹24,900",
    },
    {
      id: 3,
      name: "Kerala",
      image: "https://plus.unsplash.com/premium_photo-1697729600773-5b039ef17f3b?q=60&w=500&fit=crop",
      description: "Serenity of backwaters and lush greenery",
      price: "From ₹34,900",
    },
    {
      id: 4,
      name: "Varanasi",
      image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=60&w=500&fit=crop",
      description: "Spiritual heart of India",
      price: "From ₹19,900",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-10 flex flex-col items-start justify-between md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl">
            Explore our most popular destinations and find your next adventure
          </p>
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
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
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
