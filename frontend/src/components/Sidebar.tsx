import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Brain,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ShoppingCart,
  Wheat,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { NAVIGATION_ITEMS } from "../utils/constants";

const iconMap = {
  Dashboard: LayoutDashboard,
  Inventory: Boxes,
  "Live Sensors": Activity,
  Consumption: BarChart3,
  "AI Forecast": Brain,
  Anomalies: AlertTriangle,
  Reorder: ShoppingCart,
  Transactions: ClipboardList,
  Reports: FileText,
} as const;

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-green-950/50 backdrop-blur-[2px] transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-green-900 text-chalk shadow-lift transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-green-900 shadow-[0_4px_12px_-4px_rgba(242,176,30,0.7)]">
            <Wheat size={22} strokeWidth={2.2} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-semibold leading-tight text-white">
              Mid-Day Meal
            </h2>
            <p className="text-xs text-green-200/80">Inventory System</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-green-200 transition hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = iconMap[item.label as keyof typeof iconMap];

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-green-100/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-yellow-400 transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {Icon && (
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-yellow-300"
                            : "text-green-300/70 group-hover:text-green-200"
                        }
                      />
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System status */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow-300" />
              </span>
              <span className="text-xs font-semibold text-white">
                System Online
              </span>
            </div>

            <p className="mt-1 text-xs text-green-200/70">
              Monitoring inventory & sensors
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
