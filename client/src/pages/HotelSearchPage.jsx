import HotelFilters from "../components/HotelFilters";
import HotelSearchResults from "../components/HotelSearchResults";
export default function HotelSearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            <HotelFilters />
            <HotelSearchResults />
          </div>
        </div>
      </main>
    </div>
  );
}
