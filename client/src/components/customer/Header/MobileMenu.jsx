import { Link } from "react-router-dom";

const MobileMenu = ({ menu, onClose }) => {
  return (
    <div className="lg:hidden z-9999">
      <nav className="w-full h-screen fixed top-0 left-0 bg-white flex items-center justify-center">
        <ul className="flex font-medium flex-col space-y-4">
          {menu.map((navLink, key) => (
            <li key={key} className="block text-title-lg hover:text-primary">
              <Link to={navLink.to}>{navLink.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={onClose} className="absolute top-4 right-8">
        <i className="ri-close-line text-title-lg"></i>
      </button>
    </div>
  );
};

export default MobileMenu;
