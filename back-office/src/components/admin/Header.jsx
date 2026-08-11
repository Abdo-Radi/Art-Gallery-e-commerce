import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slices/user";

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-999 flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur-md md:px-8">
      <button
        onClick={onMenuClick}
        className="btn-icon lg:hidden"
        aria-label="Open menu"
      >
        <i className="ri-menu-line text-xl" />
      </button>

      <div className="ml-auto flex items-center gap-4">
        {user && (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-ink">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
              Administrator
            </p>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center bg-klein font-display text-base font-semibold text-paper transition-colors hover:bg-klein-deep"
            aria-label="Account menu"
            aria-expanded={open}
          >
            {user?.firstName?.charAt(0).toUpperCase() ?? "A"}
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-1"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 z-9999 mt-2 w-56 border border-line bg-paper shadow-2xl">
                {user && (
                  <div className="border-b border-line px-4 py-3">
                    <p className="text-sm font-semibold text-ink">
                      {user.username}
                    </p>
                    <p className="truncate text-xs text-stone">{user.email}</p>
                  </div>
                )}
                <button
                  onClick={signout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-ink transition-colors hover:bg-surface hover:text-klein"
                >
                  <i className="ri-logout-box-r-line" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
