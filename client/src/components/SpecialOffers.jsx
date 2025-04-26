import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Percent } from "lucide-react";

export function SpecialOffers() {
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
    <section className="bg-muted/50 px-4 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Special Offers</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">Exclusive deals and limited-time offers to make your travel dreams come true</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.title} className="group overflow-hidden border-0 p-0 shadow-md transition-shadow duration-300 hover:shadow-lg">
              <div className="relative h-72 w-full overflow-hidden">
                <Badge className="bg-primary text-primary-foreground absolute top-3 right-3 z-10">
                  <Percent className="mr-1 h-3 w-3" />
                  {offer.discount}
                </Badge>
                <img src={offer.image || "/placeholder.svg"} alt={offer.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{offer.title}</h3>
                <p className="text-muted-foreground mb-4">{offer.description}</p>
                <div className="text-muted-foreground mb-4 flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  {offer.validUntil}
                </div>
                <Button asChild className="w-full" variant="primary">
                  <Link href={offer.link}>View Offer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialOffers;
