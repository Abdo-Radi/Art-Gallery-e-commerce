import { useState } from "react";
import { Link } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri";
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
    { name: "About", to: "/about" },
    { name: "Artworks", to: "/artworks" },
    { name: "Exhibitions", to: "/exhibitions" },
  ];

  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.currentUser);
  const { items } = useSelector((state) => state.cart);

  const [open, setOpen] = useState(false);
  const [loginForm, setLoginForm] = useState(false);

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
      <header className="px-4 md:px-6 lg:px-20 py-6 text-black flex justify-between items-center border-b-[1px]">
        <h1 className="text-3xl font-bold">
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
          <button className="mr-4 relative">
            <Link to="/cart">
              <RiShoppingCartLine size={28} />
            </Link>
            {items.length > 0 && (
              <p className="flex justify-center items-center absolute top-0 right-0 bg-destructive rounded-full text-[60%] w-[14px] h-[14px] text-white">
                {items.length}
              </p>
            )}
          </button>
          {data ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      {data.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-1" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {data.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {data.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LuUser className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LuLogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setLoginForm(true)}>Login</Button>
          )}
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="ml-4 lg:hidden"
          >
            <RiMenuLine size={28} />
          </button>
        </div>
        {open && <MobileMenu menu={menu} onClose={close} />}
      </header>

      {loginForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
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
