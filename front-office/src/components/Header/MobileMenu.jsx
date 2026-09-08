import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";

/**
 * Full-screen navigation overlay.
 *
 * Portalled to <body> for the same reason as Modal: the site header carries
 * `backdrop-blur-md`, which makes it the containing block and stacking context
 * for any position:fixed descendant. Rendered inline, this menu would be
 * positioned against the header's box rather than the viewport.
 */
const MobileMenu = ({ menu, onClose }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="lg:hidden">
      <nav
        className="fixed inset-0 z-[100] flex flex-col justify-center bg-paper px-8"
        aria-label="Main menu"
      >
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
    </div>,
    document.body
  );
};

export default MobileMenu;
