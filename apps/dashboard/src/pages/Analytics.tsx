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
  const average = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  const fastest = Math.min(...durations);
  const chartData = buildings.map((building) => ({
    name: building.name.replace("Waypoint ", "").replace(" Center", ""),
    exits: building.exits.length,
    drills: events.filter((event) => event.buildingId === building.id).length
  }));

  return (
    <section>
      <h1 className="text-4xl font-black text-white">Analytics</h1>
      <p className="mt-2 text-slate-300">Compliance readiness and evacuation performance summary.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-4">
        <Card label="Avg evacuation time" value={`${average.toFixed(1)}m`} />
        <Card label="Fastest drill" value={`${fastest.toFixed(1)}m`} />
        <Card label="Buildings" value={String(buildings.length)} />
        <Card label="Compliance status" value="On Track" />
      </div>
      <div className="mt-6 h-96 rounded-3xl border border-white/10 bg-[#10213A] p-6">
        <h2 className="mb-4 text-xl font-black text-white">Exits and Drills by Building</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#1F2F46" />
            <XAxis dataKey="name" stroke="#CBD5E1" />
            <YAxis stroke="#CBD5E1" />
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
  <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
    <div className="text-sm font-bold uppercase tracking-wide text-slate-400">{label}</div>
    <div className="mt-4 text-3xl font-black text-white">{value}</div>
  </div>
);
