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
  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-white/10 bg-[#07111F] p-6 text-white">
      <div className="mb-10">
        <div className="text-3xl font-black tracking-[0.25em]">WAYPOINT</div>
        <div className="mt-2 text-sm text-blue-200">Command Dashboard</div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full rounded-xl px-4 py-3 text-left font-semibold transition ${
              currentView === item.id ? "bg-blue text-white" : "text-slate-300 hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-blue/40 bg-blue/10 p-4 text-sm text-slate-200">
        Enterprise-first evacuation intelligence for facilities teams.
      </div>
      <button onClick={() => void onSignOut()} className="mt-4 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">
        Sign out
      </button>
    </aside>
  );
};
