import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-12 bg-gray-100 border-t border-dark">
      <div className="px-8 lg:px-24 py-8 flex flex-wrap justify-between items-start">
        <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
          <Link to="/" className="text-black text-2xl font-bold uppercase">
            Horizons
          </Link>
          <p className="text-gray-700 mt-2">
            Explore the world of art with Horizons.
          </p>
        </div>

        <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
          <strong className="block text-black text-lg font-semibold mb-2">
            Main Links
          </strong>
          <ul>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-black">
                About
              </Link>
            </li>
            <li>
              <Link to="/artworks" className="text-gray-700 hover:text-black">
                Artworks
              </Link>
            </li>
            <li>
              <Link
                to="/exhibitions"
                className="text-gray-700 hover:text-black"
              >
                Exhibitions
              </Link>
            </li>
            <li>
              <Link to="/tickets" className="text-gray-700 hover:text-black">
                Tickets
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
          <strong className="block text-black text-lg font-semibold mb-2">
            External Links
          </strong>
          <ul>
            <li>
              <a href="#" className="text-gray-700 hover:text-black">
                Terms and Conditions
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-black">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-black">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-black">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-1/4">
          <strong className="block text-black text-lg font-semibold mb-2">
            Contact
          </strong>
          <ul>
            <li>Email: info@horizons.com</li>
            <li>Phone: +1 123 456 7890</li>
            <li>Address: 123 Gallery Street, City</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border-t border-stroke py-4">
        <div className="px-8 lg:px-24 flex justify-between items-center">
          <span className="text-gray-800">
            Created with 💙 by Imane's students
          </span>
          <span className="text-gray-800">
            &copy; {new Date().getFullYear()} - Horizons
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
