import { useEffect, useMemo, useState } from "react";
import type { Building, EvacuationEvent } from "@waypoint/types";

interface EvacuationMonitorProps {
  activeEvent: EvacuationEvent | null;
  building: Building;
}

export const EvacuationMonitor = ({ activeEvent, building }: EvacuationMonitorProps) => {
  const [now, setNow] = useState(Date.now());
  const estimatedUsers = activeEvent?.userCount ?? building.employeeCount ?? building.floors * 110;
  const eventScopePercent = activeEvent && estimatedUsers > 0 ? 100 : 0;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const elapsed = useMemo(() => {
    if (!activeEvent) {
      return "00:00";
    }

    const seconds = Math.max(0, Math.floor((now - new Date(activeEvent.triggeredAt).getTime()) / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }, [activeEvent, now]);

  return (
    <section>
      <h1 className="text-3xl font-black text-white sm:text-4xl">Evacuation Monitor</h1>
      <p className="mt-2 max-w-2xl text-slate-300">Current evacuation event status and affected user scope.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3 xl:gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Event status</div>
          <div className={`mt-4 text-2xl font-black sm:text-3xl ${activeEvent ? "text-red-300" : "text-green-300"}`}>
            {activeEvent ? "Active" : "Standby"}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Elapsed time</div>
          <div className="mt-4 text-2xl font-black text-white sm:text-3xl">{elapsed}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">People in scope</div>
          <div className="mt-4 text-2xl font-black text-blue sm:text-3xl">
            {activeEvent ? estimatedUsers : 0}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:mt-6 sm:p-6">
        <div className="mb-3 flex flex-col gap-1 text-sm font-bold text-slate-300 sm:flex-row sm:justify-between">
          <span>{building.name}</span>
          <span>{activeEvent ? "Active event" : "No active event"}</span>
        </div>
        <div className="h-5 overflow-hidden rounded-full bg-navy">
          <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${eventScopePercent}%` }} />
        </div>
      </div>
    </section>
  );
};
