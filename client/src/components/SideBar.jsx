import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const defaultSidebarItems = [
  { id: "profile", label: "Profile" },
  { id: "details", label: "Details" },
  { id: "update", label: "Update Profile" },
  { id: "orders", label: "Order History" },
];

function SideBar({
  activeSection,
  onSectionChange,
  onLogout,
  userName,
  showMobileTrigger = true,
  showDesktopSidebar = true,
  desktopDocked = false,
  items = defaultSidebarItems,
  panelLabel = "Account",
  panelName = "Profile",
}) {
  const [open, setOpen] = useState(false);
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "U";
  const activeItemLabel =
    items.find((item) => item.id === activeSection)?.label || "Dashboard";

  const renderSidebarHeader = () => (
    <div className="border-b border-black/10 px-2 pb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/45">
        {panelLabel}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-black">
        {userName ? `Hi ${userName}` : `Your ${panelName}`}
      </h2>
    </div>
  );

  const renderSidebarContent = () => (
    <>
      <nav className="mt-4 flex flex-col gap-2">
        {items.map((item) => {
          const isActive = item.id === activeSection;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSectionChange(item.id);
                setOpen(false);
              }}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "bg-[#faf7f1] text-black/75 hover:bg-black/5 hover:text-black"
              }`}
            >
              {item.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            onLogout();
            setOpen(false);
          }}
          className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          Logout
        </button>
      </nav>
    </>
  );

  return (
    <>
      <div className={showMobileTrigger ? "lg:hidden" : "hidden"}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-3xl border border-black/10 bg-white px-4 py-4 text-left shadow-sm transition-colors hover:bg-black/5"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#faf7f1] p-3 text-black">
              <FaBars className="h-4 w-4" />
            </span>
            <span className="block">
              <span className="block text-base font-semibold text-black">
                {activeItemLabel}
              </span>
              <span className="block text-xs text-black/45">{panelName} Dashboard</span>
            </span>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#faf7f1] text-sm font-semibold text-black">
            {userInitial}
          </span>
        </button>
      </div>

      <aside
        className={`${
          desktopDocked
            ? "hidden h-full min-h-[calc(100vh-80px)] border-r border-black/10 bg-white px-5 py-6 lg:flex lg:flex-col"
            : "hidden rounded-3xl border border-black/10 bg-white p-4 shadow-sm lg:block"
        } ${
          showDesktopSidebar ? "" : "hidden"
        }`}
      >
        {renderSidebarHeader()}
        {renderSidebarContent()}
      </aside>

      <div
        className={`fixed inset-0 z-[70] lg:hidden ${
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              {renderSidebarHeader()}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-black/10 p-2 text-black transition-colors hover:bg-black/5"
              aria-label="Close account menu"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          {renderSidebarContent()}
        </aside>
      </div>
    </>
  );
}

export default SideBar;
