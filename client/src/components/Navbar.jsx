import { useState } from "react";
import { Link } from "react-router-dom";
import Authentication from "./Authentication.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/product" },
  { name: "Story", href: "/story" },
  { name: "About", href: "/about" },
];

function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const userName = user?.fullName?.trim()?.split(" ")[0] || user?.fullName || "";

  return (
    <>
      <div className="h-[72px]" />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-md">
        <div className="px-4 py-3 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="z-10 text-xl italic font-bold tracking-wide text-white sm:text-2xl"
            >
              NOMAD.
            </Link>

            <div className="hidden items-center gap-6 text-sm text-white/90 lg:flex">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 after:content-[''] hover:text-white hover:after:w-full"
                >
                  {item.name.toUpperCase()}
                </Link>
              ))}

              {userName ? (
                <Link
                  to="/profile"
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  {`Hi ${userName}`}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Get Started
                </button>
              )}
            </div>

            <button
              type="button"
              className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
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
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 flex h-full w-4/5 max-w-sm flex-col bg-[#f7f4ee] p-6 text-black shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent" />
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e9e2d6] blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/70 blur-3xl" />
          </div>

          <div className="relative flex items-center justify-between">
            <span className="text-lg font-bold tracking-wide">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-black/5"
            >
              Close
            </button>
          </div>

          <div className="relative mt-6 flex flex-1 flex-col">
            <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-4">
              <p className="text-sm font-semibold text-black">Explore NOMAD.</p>
              <p className="mt-1 text-xs text-black/60">
                Clean fashion UI placeholder menu.
              </p>
            </div>

            <div className="my-6 h-px bg-black/10" />

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
                  className="flex w-full items-center justify-center rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white"
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
                  className="flex w-full items-center justify-center rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
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

export default Navbar;
