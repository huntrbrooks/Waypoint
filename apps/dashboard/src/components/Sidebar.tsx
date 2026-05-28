import { useState } from "react";

export type DashboardView = "buildings" | "detail" | "monitor" | "analytics" | "settings";

interface SidebarProps {
  currentView: DashboardView;
  onChange: (view: DashboardView) => void;
  onSignOut: () => Promise<void>;
}

const navItems: Array<{ id: DashboardView; label: string }> = [
  { id: "buildings", label: "Buildings" },
  { id: "detail", label: "Building Detail" },
  { id: "monitor", label: "Evacuation Monitor" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" }
];

export const Sidebar = ({ currentView, onChange, onSignOut }: SidebarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (view: DashboardView) => {
    onChange(view);
    setMenuOpen(false);
  };

  return (
    <aside className="sticky top-0 z-30 border-b border-white/10 bg-[#07111F]/95 text-white backdrop-blur lg:flex lg:min-h-dvh lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:bg-[#07111F]">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:block lg:p-6">
        <div className="min-w-0">
          <div className="truncate text-xl font-black tracking-[0.2em] sm:text-2xl lg:text-3xl lg:tracking-[0.25em]">WAYPOINT</div>
          <div className="mt-1 text-xs text-blue-200 sm:text-sm lg:mt-2">Command Dashboard</div>
        </div>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="dashboard-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          className="inline-flex min-h-11 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue lg:hidden"
        >
          Menu
        </button>
      </div>
      <nav id="dashboard-navigation" className={`${menuOpen ? "block" : "hidden"} space-y-2 px-4 pb-4 sm:px-6 lg:block lg:px-6 lg:pb-0`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleChange(item.id)}
            className={`min-h-11 w-full rounded-xl px-4 py-3 text-left font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue ${
              currentView === item.id ? "bg-blue text-white" : "text-slate-300 hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="hidden lg:mt-auto lg:block lg:px-6 lg:pb-6">
        <div className="rounded-2xl border border-blue/40 bg-blue/10 p-4 text-sm text-slate-200">
          Enterprise-first evacuation intelligence for facilities teams.
        </div>
        <button
          onClick={() => void onSignOut()}
          className="mt-4 min-h-11 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue"
        >
          Sign out
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-white/10 px-4 pb-4 sm:px-6 lg:hidden">
          <button
            onClick={() => void onSignOut()}
            className="mt-4 min-h-11 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
};
