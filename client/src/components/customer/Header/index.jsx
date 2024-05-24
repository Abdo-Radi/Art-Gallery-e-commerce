import { useState } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import Head from "./Head";
const Header = () => {
  const menu = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Artworks", to: "/artworks" },
    { name: "Exhibitions", to: "/exhibitions" },
  ];

  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };

  return (
    <>
      {/* <Head /> */}
      <header className="px-8 lg:px-24 py-4 text-black flex justify-between items-center">
        <h1 className="text-title-lg font-bold">
          <span className="text-primary">H</span>orizons
        </h1>
        <nav className="hidden lg:flex justify-between items-center">
          <ul className="flex font-medium flex-row space-x-6">
            {menu.map((navLink, key) => (
              <li key={key} className="block hover:text-primary">
                <Link to={navLink.to}>{navLink.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center">
          <button className="mr-4">
            <Link to="/cart"><i className="ri-shopping-cart-line text-title-lg"></i></Link>
          </button>
          <button className="bg-primary text-sm p-2 text-white">
            Login / Sign up
          </button>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="ml-4 lg:hidden"
          >
            <i className="ri-menu-line text-title-lg"></i>
          </button>
        </div>
        {open && <MobileMenu menu={menu} onClose={close} />}
      </header>
    </>
  );
};

export default Header;
