import { useState } from "react";
import { Link } from "react-router-dom";
import { RiShoppingBagLine } from "react-icons/ri";
import { RiMenuLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

import MobileMenu from "./MobileMenu";
import Login from "../Login";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LuUser, LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/slices/user";
import { clearCart } from "@/redux/slices/cart";

const Header = () => {
  const menu = [
    { name: "Home", to: "/" },
    { name: "Artworks", to: "/artworks" },
    { name: "Exhibitions", to: "/exhibitions" },
    { name: "About", to: "/about" },
  ];

  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.currentUser);
  const { items } = useSelector((state) => state.cart);

  const [open, setOpen] = useState(false);
  const [loginForm, setLoginForm] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const logout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearCart());
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <Link to="/" className="group flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold tracking-wide">
              Horizons
            </span>
            <span className="mb-0.5 inline-block h-2 w-2 bg-klein transition-transform duration-300 group-hover:-translate-y-1" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {menu.map((navLink, key) => (
                <li key={key}>
                  <Link className="nav-link" to={navLink.to}>
                    {navLink.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-1 text-ink transition-colors hover:text-klein"
              aria-label="Shopping cart"
            >
              <RiShoppingBagLine size={22} />
              {items.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-klein px-1 text-[10px] font-medium leading-none text-paper">
                  {cartCount}
                </span>
              )}
            </Link>

            {data ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0"
                  >
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarFallback className="bg-klein font-display text-sm text-paper">
                        {data.firstName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="mt-2 w-52 border-line bg-paper"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {data.username}
                      </p>
                      <p className="text-xs leading-none text-stone">
                        {data.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-line" />
                  <DropdownMenuItem className="cursor-pointer">
                    <LuUser className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-line" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LuLogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setLoginForm(true)}
                className="hidden h-9 px-5 text-[12px] font-semibold uppercase tracking-[0.15em] sm:inline-flex"
              >
                Sign in
              </Button>
            )}

            <button
              onClick={() => {
                setOpen(true);
              }}
              className="p-1 text-ink transition-colors hover:text-klein lg:hidden"
              aria-label="Open menu"
            >
              <RiMenuLine size={24} />
            </button>
          </div>
        </div>
        {open && <MobileMenu menu={menu} onClose={close} />}
      </header>

      {loginForm && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-stone/50 backdrop-blur-sm">
          <Login
            onClose={() => {
              setLoginForm(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default Header;
