import type { Building, EvacuationEvent } from "@waypoint/types";

interface BuildingsListProps {
  buildings: Building[];
  activeEvent: EvacuationEvent | null;
  selectedBuildingId: string;
  onSelect: (buildingId: string) => void;
}

export const BuildingsList = ({ buildings, activeEvent, selectedBuildingId, onSelect }: BuildingsListProps) => {
  return (
    <section>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-black text-white sm:text-4xl">Buildings</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Monitor evacuation readiness across the enterprise portfolio.</p>
      </div>
      <div className="grid gap-4 md:hidden">
        {buildings.map((building) => {
          const active = activeEvent?.buildingId === building.id;
          const selected = selectedBuildingId === building.id;

          return (
            <button
              key={building.id}
              onClick={() => onSelect(building.id)}
              className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue ${
                selected ? "border-blue bg-blue/10" : "border-white/10 bg-[#10213A] hover:bg-white/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1 inline-flex h-3 w-3 shrink-0 rounded-full ${active ? "bg-red-500" : "bg-green-400"}`} />
                <div className="min-w-0">
                  <div className="font-bold text-white">{building.name}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-300">{building.address}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="rounded-xl bg-navy p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Floors</div>
                  <div className="mt-1 font-black text-white">{building.floors}</div>
                </div>
                <div className="rounded-xl bg-navy p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Exits</div>
                  <div className="mt-1 font-black text-white">{building.exits.length}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-[#10213A] md:block">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-sm uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Building</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Floors</th>
              <th className="px-6 py-4">Exits</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => {
              const active = activeEvent?.buildingId === building.id;
              return (
                <tr
                  key={building.id}
                  onClick={() => onSelect(building.id)}
                  className={`cursor-pointer border-t border-white/10 transition hover:bg-white/5 ${
                    selectedBuildingId === building.id ? "bg-blue/10" : ""
                  }`}
                >
                  <td className="px-6 py-5">
                    <span className={`inline-flex h-3 w-3 rounded-full ${active ? "bg-red-500" : "bg-green-400"}`} />
                  </td>
                  <td className="px-6 py-5 font-bold text-white">{building.name}</td>
                  <td className="px-6 py-5 text-slate-300">{building.address}</td>
                  <td className="px-6 py-5 text-slate-300">{building.floors}</td>
                  <td className="px-6 py-5 text-slate-300">{building.exits.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
