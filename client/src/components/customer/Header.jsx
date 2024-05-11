import { Link } from "react-router-dom";

const Header = () => {
  const menu = [
    { name: "About", to: "/about" },
    { name: "Artworks", to: "/artworks" },
    { name: "Exhibitions", to: "/exhibitions" },
    { name: "Tickets", to: "/tickets" },
  ];

  return (
    <header className="px-8 lg:px-24 py-4 text-black flex flex-wrap justify-between items-center">
      <h1 className="text-title-lg font-bold">Horizons</h1>
      <div className="flex items-center lg:order-2">
        <button className="bg-primary text-sm p-2 text-white">
          Login / Sign up
        </button>
        <button className="ml-4 lg:hidden">
          <i className="ri-menu-line text-title-lg"></i>
        </button>
      </div>
      <nav className="w-full lg:w-auto justify-between items-center lg:flex lg:order-1">
        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-6 lg:mt-0">
          {menu.map((navLink, key) => (
            <li key={key} className="block hover:text-primary">
              <Link to={navLink.to}>{navLink.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
