import { NavLink, Link } from "react-router-dom";

const navGroups = [
  {
    title: "Overview",
    links: [
      { name: "Dashboard", to: "/admin", end: true, icon: "ri-dashboard-line" },
    ],
  },
  {
    title: "Catalogue",
    links: [
      { name: "Artworks", to: "/admin/artworks", icon: "ri-paint-brush-line" },
      { name: "Categories", to: "/admin/categories", icon: "ri-price-tag-3-line" },
    ],
  },
  {
    title: "Programme",
    links: [
      { name: "Exhibitions", to: "/admin/exhibitions", icon: "ri-gallery-line" },
      { name: "Tickets", to: "/admin/tickets", icon: "ri-coupon-2-line" },
    ],
  },
  {
    title: "People",
    links: [
      { name: "Artists", to: "/admin/artists", icon: "ri-user-star-line" },
      { name: "Customers", to: "/admin/customers", icon: "ri-user-heart-line" },
      { name: "Admins", to: "/admin/admins", icon: "ri-shield-user-line" },
    ],
  },
  {
    title: "Sales",
    links: [
      { name: "Orders", to: "/admin/orders", icon: "ri-shopping-basket-2-line" },
    ],
  },
];

const linkClass = ({ isActive }) =>
  [
    "group relative flex items-center gap-3 py-2.5 pl-4 pr-3 text-sm transition-colors",
    isActive
      ? "bg-paper/10 font-semibold text-paper"
      : "text-paper/70 hover:text-paper",
  ].join(" ");

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Dim behind the drawer on small screens */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-999 bg-stone/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-64 flex-col bg-ink-deep transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link to="/admin" className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-paper">
              Horizons
            </span>
            <span className="mb-0.5 inline-block h-1.5 w-1.5 bg-klein" />
          </Link>
          <button
            onClick={onClose}
            className="text-paper/70 transition-colors hover:text-paper lg:hidden"
            aria-label="Close menu"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <p className="px-6 pb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/50">
          Gallery admin
        </p>

        <nav className="no-scrollbar flex-1 overflow-y-auto pb-8">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <h3 className="mb-2 px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/50">
                {group.title}
              </h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={onClose}
                      className={linkClass}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`absolute left-0 top-0 h-full w-0.5 transition-colors ${
                              isActive ? "bg-klein" : "bg-transparent"
                            }`}
                          />
                          <i className={`${link.icon} text-base`} />
                          {link.name}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-paper/10 px-6 py-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-paper/50">
            © 2026 Horizons
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
