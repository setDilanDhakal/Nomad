import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Authentication from "./Authentication.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/product" },
  { name: "Story", href: "/story" },
  { name: "About", href: "/about" },
];

function ProductNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const userName = user?.fullName?.trim()?.split(" ")[0] || user?.fullName || "";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="order-2 ml-auto text-xl italic font-bold tracking-wide text-black sm:text-2xl lg:order-none lg:ml-0"
            >
              NOMAD.
            </Link>

            <nav className="hidden items-center gap-6 lg:ml-auto lg:flex">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-semibold tracking-wide text-black/70 transition-colors hover:text-black"
                >
                  {item.name.toUpperCase()}
                </Link>
              ))}
            </nav>

            {userName ? (
              <Link
                to="/profile"
                className="hidden rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-[#f7f4ee] transition-colors hover:bg-black/85 lg:inline-flex"
              >
                {`Hi ${userName}`}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                className="hidden rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-[#f7f4ee] transition-colors hover:bg-black/85 lg:inline-flex"
              >
                Get Started
              </button>
            )}

            <button
              type="button"
              className="order-1 rounded-lg border border-black/10 px-3 py-2 text-black transition-colors hover:bg-black/5 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <FaBars className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-4/5 max-w-xs flex-col border-r border-black/10 bg-white p-5 shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">
            <div>
              <p className="text-lg font-bold italic tracking-wide text-black">NOMAD.</p>
              <p className="text-xs text-black/50">Navigation</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-black/10 p-2 text-black transition-colors hover:bg-black/5"
              aria-label="Close menu"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold tracking-wide text-black/80 transition-colors hover:bg-black/5 hover:text-black"
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            {userName ? (
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl border border-black bg-black px-4 py-3 text-sm font-semibold text-[#f7f4ee] transition-colors hover:bg-black/85"
              >
                {`Hi ${userName}`}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowAuth(true);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-center rounded-xl border border-black bg-black px-4 py-3 text-sm font-semibold text-[#f7f4ee] transition-colors hover:bg-black/85"
              >
                Get Started
              </button>
            )}
          </div>
        </aside>
      </div>

      {showAuth ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-[#f7f4ee] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAuth(false)}
              className="absolute right-4 top-4 rounded-full border border-black/10 px-3 py-1 text-sm text-black transition-colors hover:bg-black/5"
            >
              Close
            </button>
            <Authentication onSuccess={() => setShowAuth(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProductNavbar;
