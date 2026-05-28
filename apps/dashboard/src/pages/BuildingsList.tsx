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
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">Buildings</h1>
        <p className="mt-2 text-slate-300">Monitor evacuation readiness across the enterprise portfolio.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#10213A]">
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
