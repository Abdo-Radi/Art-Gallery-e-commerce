import { Link } from "react-router-dom";

const Sidebar = () => {
  const navLinks = [
    {
      name: "Dashboard",
      to: "/admin",
      icon: <i className="ri-dashboard-line"></i>,
    },
    {
      name: "Admins",
      to: "/admin/admins",
      icon: <i className="ri-shield-user-line"></i>,
    },
    {
      name: "Artists",
      to: "/admin/artists",
      icon: <i className="ri-user-line"></i>,
    },
    {
      name: "Customers",
      to: "/admin/customers",
      icon: <i className="ri-user-heart-line"></i>,
    },
    {
      name: "Artworks",
      to: "/admin/artworks",
      icon: <i className="ri-paint-brush-line"></i>,
    },
    {
      name: "Categories",
      to: "/admin/categories",
      icon: <i className="ri-list-settings-line"></i>,
    },
    {
      name: "Exhibitions",
      to: "/admin/exhibitions",
      icon: <i className="ri-carousel-view"></i>,
    },
    {
      name: "Orders",
      to: "/admin/orders",
      icon: <i className="ri-shopping-basket-2-line"></i>,
    },
  ];

  return (
    <aside className="hidden absolute left-0 top-0 z-9999 lg:flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0">
      <div className="px-6 py-5.5 lg:py-6.5">
        <Link to="/admin" className="text-white text-title-xl2">
          Horizons
        </Link>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="text-sm font-semibold text-bodydark2">MENU</h3>

            <ul className="mt-4">
              {navLinks.map((link, index) => (
                <li key={index} className="my-1">
                  <Link
                    to={link.to}
                    className="relative flex gap-2.5 rounded-sm py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:text-primary"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
