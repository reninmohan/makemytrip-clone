import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">MakeMyTrip</h3>
            <p className="text-sm text-gray-300">Book flights and hotels at the best prices. Travel made easy.</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/flights" className="text-gray-300 hover:text-white">
                  Flights
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-gray-300 hover:text-white">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-300 hover:text-white">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="https://x.com/" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.82 7.6c.004.1.007.198.007.298 0 3.045-2.318 6.56-6.56 6.56a6.529 6.529 0 01-3.532-1.033 4.618 4.618 0 003.407-.954 2.303 2.303 0 01-2.15-1.6 2.295 2.295 0 001.04-.04 2.302 2.302 0 01-1.847-2.256v-.029c.31.173.666.277 1.044.29a2.295 2.295 0 01-.713-3.07 6.54 6.54 0 004.749 2.407 2.302 2.302 0 013.926-2.098 4.602 4.602 0 001.463-.559 2.31 2.31 0 01-1.012 1.275 4.591 4.591 0 001.324-.363 4.67 4.67 0 01-1.147 1.19z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.2 15.6h-2.4V9.6h2.4v8zm-1.2-9.36c-.663 0-1.2-.537-1.2-1.2 0-.663.537-1.2 1.2-1.2.663 0 1.2.537 1.2 1.2 0 .663-.537 1.2-1.2 1.2zM16.8 17.6h-2.4v-4.8c0-.663-.537-1.2-1.2-1.2-.663 0-1.2.537-1.2 1.2v4.8H9.6V9.6h2.4v.96c.48-.576 1.2-.96 2.4-.96 1.68 0 2.4 1.44 2.4 3.12v4.88z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between border-t border-gray-700 pt-8 md:flex-row">
          <p className="text-sm text-gray-300">{new Date().getFullYear()} MakeMyTrip. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="mr-4 text-sm text-gray-300 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
