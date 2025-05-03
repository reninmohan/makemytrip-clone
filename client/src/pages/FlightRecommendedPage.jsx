import { Plane } from "lucide-react";
import FlightSearchForm from "../components/FlightSearchForm";
import { Card, CardContent } from "@/components/ui/card";
function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
        }}
      />
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">Find Your Perfect Trip</h1>
          <p className="text-lg text-white/90 md:text-xl">
            Find and book the best deals on flights and hotels worldwide
          </p>
        </div>

        <Card className="mx-auto max-w-4xl overflow-hidden bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center">
              <Plane className="text-muted-foreground mr-2 h-5 w-5" />
              <h2 className="text-lg font-semibold">Flights</h2>
            </div>
            <FlightSearchForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Hero;
