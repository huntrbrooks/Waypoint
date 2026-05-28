import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Building, EvacuationEvent } from "@waypoint/types";

interface AnalyticsProps {
  buildings: Building[];
  events: EvacuationEvent[];
}

const minutesBetween = (start: string, end: string | null) => {
  if (!end) {
    return 0;
  }

  return (new Date(end).getTime() - new Date(start).getTime()) / 60000;
};

export const Analytics = ({ buildings, events }: AnalyticsProps) => {
  const durations = events.map((event) => minutesBetween(event.triggeredAt, event.resolvedAt)).filter(Boolean);
  const average = durations.length > 0 ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length : null;
  const fastest = durations.length > 0 ? Math.min(...durations) : null;
  const chartData = buildings.map((building) => ({
    name: building.name.replace("Waypoint ", "").replace(" Center", ""),
    exits: building.exits.length,
    drills: events.filter((event) => event.buildingId === building.id).length
  }));

  return (
    <section>
      <h1 className="text-3xl font-black text-white sm:text-4xl">Analytics</h1>
      <p className="mt-2 max-w-2xl text-slate-300">Compliance readiness and evacuation performance summary.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        <Card label="Avg evacuation time" value={average === null ? "No resolved drills" : `${average.toFixed(1)}m`} />
        <Card label="Fastest drill" value={fastest === null ? "No resolved drills" : `${fastest.toFixed(1)}m`} />
        <Card label="Buildings" value={String(buildings.length)} />
        <Card label="Compliance status" value="On Track" />
      </div>
      <div className="mt-4 h-[22rem] rounded-3xl border border-white/10 bg-[#10213A] p-4 sm:mt-6 sm:h-96 sm:p-6">
        <h2 className="mb-4 text-lg font-black text-white sm:text-xl">Exits and Drills by Building</h2>
        <ResponsiveContainer width="100%" height="82%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#1F2F46" />
            <XAxis dataKey="name" stroke="#CBD5E1" tick={{ fontSize: 12 }} interval={0} />
            <YAxis stroke="#CBD5E1" tick={{ fontSize: 12 }} width={32} />
            <Tooltip contentStyle={{ background: "#0A1628", border: "1px solid #1E6FFF", color: "#FFFFFF" }} />
            <Bar dataKey="exits" fill="#1E6FFF" />
            <Bar dataKey="drills" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

const Card = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:p-6">
    <div className="text-sm font-bold uppercase tracking-wide text-slate-400">{label}</div>
    <div className="mt-4 break-words text-2xl font-black text-white sm:text-3xl">{value}</div>
  </div>
);
