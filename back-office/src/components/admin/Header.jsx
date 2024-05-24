import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const signout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    user && (
      <header className="sticky top-0 z-999 px-6 py-2 flex justify-end items-center gap-3 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <p>
          {user.firstName} {user.lastName}
        </p>
        <div>
          <span
            onClick={() => (open ? setOpen(false) : setOpen(true))}
            className="bg-bodydark1 flex items-center justify-center text-black h-12 w-12 rounded-full cursor-pointer"
          >
            {user.firstName.charAt(0).toUpperCase()}
          </span>
          {open && (
            <div className="absolute right-6 z-10 mt-2 w-48 border border-stroke shadow-default bg-white text-neutral-content">
              <div className="flex flex-col items-start">
                <button
                  onClick={signout}
                  className="w-full text-left px-4 py-2 hover:bg-whiten"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    )
  );
};

export default Header;
