import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plane, Building } from "lucide-react";
import FlightSearchForm from "../components/FlightSearchForm";
import HotelSearchForm from "../components/HotelSearchForm";
function Hero({ onHotelSearch, handleFlightSearch }) {
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
          <p className="text-lg text-white/90 md:text-xl">Find and book the best deals on flights and hotels worldwide</p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg">
          <Tabs defaultValue="hotels" className="w-full">
            <TabsList className="bg-muted/50 grid h-16 w-full grid-cols-2 rounded-none">
              <TabsTrigger value="hotels" className="data-[state=active]:bg-background h-full rounded-none">
                <Building className="mr-2 h-4 w-4" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="flights" className="data-[state=active]:bg-background h-full rounded-none">
                <Plane className="mr-2 h-4 w-4" />
                Flights
              </TabsTrigger>
            </TabsList>
            <TabsContent value="hotels" className="p-6">
              <HotelSearchForm onHotelSearch={onHotelSearch} />
            </TabsContent>
            <TabsContent value="flights" className="p-6">
              <FlightSearchForm handleFlightSearch={handleFlightSearch} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default Hero;
