import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-50 py-8 md:py-12">
      <div className="container px-4 md:px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-semibold">
            <span className="text-primary">H</span>orizons
          </span>
        </div>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link className="text-sm hover:underline" href="#">
            Home
          </Link>
          <Link className="text-sm hover:underline" href="#">
            About
          </Link>
          <Link className="text-sm hover:underline" href="#">
            Artworks
          </Link>
          <Link className="text-sm hover:underline" href="#">
            Exhibitions
          </Link>
        </nav>
        <p className="text-sm text-gray-400">
          © 2024 Horizons. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
