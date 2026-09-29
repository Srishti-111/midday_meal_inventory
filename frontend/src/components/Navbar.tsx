import { Bell, Menu, UserCircle } from "lucide-react";

interface NavbarProps {
  title?: string;
  onMenuClick?: () => void;
}

const Navbar = ({ title = "Dashboard", onMenuClick }: NavbarProps) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-green-100 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-lg p-2 text-green-800 transition hover:bg-green-50 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="font-display text-xl font-semibold leading-tight text-green-900">
            {title}
          </h1>
          <p className="hidden text-xs text-gray-500 sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative rounded-full p-2 text-gray-600 transition hover:bg-green-50 hover:text-green-800"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-400 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-gray-200 pl-3 sm:pl-4">
          <UserCircle size={34} strokeWidth={1.5} className="text-green-700" />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-gray-800">
              Admin
            </p>
            <p className="text-xs text-gray-500">Inventory Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
