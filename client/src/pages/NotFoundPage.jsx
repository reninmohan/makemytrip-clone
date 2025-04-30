import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-16">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="mb-8 text-lg text-white/90">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <Button asChild variant="destructive">
          <Link to="/" className="text-lg">
            Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
