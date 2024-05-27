import { Link } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";

const MobileMenu = ({ menu, onClose }) => {
  return (
    <div className="lg:hidden z-50">
      <nav className="w-full h-screen fixed top-0 left-0 bg-white flex items-center justify-center">
        <ul className="flex font-medium flex-col space-y-4">
          {menu.map((navLink, key) => (
            <li key={key} className="block text-2xl hover:text-primary">
              <Link to={navLink.to}>{navLink.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={onClose} className="absolute top-6 right-4 md:right-6">
        <RiCloseFill size={28} />
      </button>
    </div>
  );
};

export default MobileMenu;
