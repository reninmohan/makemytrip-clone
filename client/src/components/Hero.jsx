import { useState } from "react";
import { HotelSearch } from "@/components/hotel-search";
import { FlightSearch } from "@/components/flight-search";
import { Plane, Building } from "lucide-react";

export function Hero() {
  const [activeTab, setActiveTab] = useState("hotels");

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
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">Discover Your Perfect Trip</h1>
          <p className="text-lg text-white/90 md:text-xl">Find and book the best deals on flights and hotels worldwide</p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="flex">
            <button className={`flex h-16 flex-1 items-center justify-center gap-2 font-medium transition ${activeTab === "hotels" ? "border-b-2 border-blue-600 bg-white text-blue-600" : "bg-muted text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("hotels")}>
              <Building className="h-4 w-4" />
              Hotels
            </button>
            <button className={`flex h-16 flex-1 items-center justify-center gap-2 font-medium transition ${activeTab === "flights" ? "border-b-2 border-blue-600 bg-white text-blue-600" : "bg-muted text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("flights")}>
              <Plane className="h-4 w-4" />
              Flights
            </button>
          </div>

          <div className="p-6">{activeTab === "hotels" ? <HotelSearch /> : <FlightSearch />}</div>
        </div>
      </div>
    </section>
  );
}
