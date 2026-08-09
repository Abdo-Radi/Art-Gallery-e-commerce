import { Link } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";

const MobileMenu = ({ menu, onClose }) => {
  return (
    <div className="lg:hidden">
      <nav className="fixed left-0 top-0 z-50 flex h-screen w-full flex-col justify-center bg-paper px-8">
        <p className="eyebrow mb-8">Menu</p>
        <ul className="flex flex-col gap-2">
          {menu.map((navLink, key) => (
            <li key={key} className="border-b border-line">
              <Link
                onClick={onClose}
                to={navLink.to}
                className="group flex items-baseline justify-between py-4"
              >
                <span className="font-display text-4xl font-semibold transition-colors group-hover:text-klein">
                  {navLink.name}
                </span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-stone">
                  0{key + 1}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-1 text-ink transition-colors hover:text-klein"
          aria-label="Close menu"
        >
          <RiCloseFill size={32} />
        </button>
      </nav>
    </div>
  );
};

export default MobileMenu;
