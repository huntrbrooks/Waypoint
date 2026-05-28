import { useEffect, useMemo, useState } from "react";
import type { Building, EvacuationEvent } from "@waypoint/types";

interface EvacuationMonitorProps {
  activeEvent: EvacuationEvent | null;
  building: Building;
}

export const EvacuationMonitor = ({ activeEvent, building }: EvacuationMonitorProps) => {
  const [evacuated, setEvacuated] = useState(0);
  const [now, setNow] = useState(Date.now());
  const estimatedUsers = activeEvent?.userCount ?? building.floors * 110;

  useEffect(() => {
    setEvacuated(0);
  }, [activeEvent?.id]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
      setEvacuated((value) => Math.min(estimatedUsers, value + Math.ceil(Math.random() * 18)));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [estimatedUsers]);

  const elapsed = useMemo(() => {
    if (!activeEvent) {
      return "00:00";
    }

    const seconds = Math.max(0, Math.floor((now - new Date(activeEvent.triggeredAt).getTime()) / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }, [activeEvent, now]);

  return (
    <section>
      <h1 className="text-4xl font-black text-white">Evacuation Monitor</h1>
      <p className="mt-2 text-slate-300">Live drill telemetry with mock real-time movement.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Event status</div>
          <div className={`mt-4 text-3xl font-black ${activeEvent ? "text-red-300" : "text-green-300"}`}>
            {activeEvent ? "Active" : "Standby"}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Elapsed time</div>
          <div className="mt-4 text-3xl font-black text-white">{elapsed}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Evacuated</div>
          <div className="mt-4 text-3xl font-black text-blue">
            {evacuated}/{estimatedUsers}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 bg-[#10213A] p-6">
        <div className="mb-3 flex justify-between text-sm font-bold text-slate-300">
          <span>{building.name}</span>
          <span>{Math.round((evacuated / estimatedUsers) * 100)}%</span>
        </div>
        <div className="h-5 overflow-hidden rounded-full bg-navy">
          <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${Math.min(100, (evacuated / estimatedUsers) * 100)}%` }} />
        </div>
      </div>
    </section>
  );
};
