import { useState } from "react";
import type { Building, EvacuationEvent, Exit } from "@waypoint/types";

interface BuildingDetailProps {
  building: Building;
  activeEvent: EvacuationEvent | null;
  onAddExit: (input: Pick<Exit, "lat" | "lng" | "floor" | "label">) => void;
  onTrigger: () => void;
}

export const BuildingDetail = ({ building, activeEvent, onAddExit, onTrigger }: BuildingDetailProps) => {
  const [label, setLabel] = useState("Manual Exit");
  const [floor, setFloor] = useState("1");

  const addExit = () => {
    onAddExit({
      floor: Number(floor) || 1,
      lat: Number(((building.exits[0]?.lat ?? 40) + Math.random() / 1000).toFixed(6)),
      lng: Number(((building.exits[0]?.lng ?? -73) + Math.random() / 1000).toFixed(6)),
      label
    });
    setLabel("Manual Exit");
  };

  return (
    <section>
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">{building.name}</h1>
          <p className="mt-2 text-slate-300">{building.address}</p>
        </div>
        <button onClick={onTrigger} className="rounded-xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-400">
          Trigger Evacuation
        </button>
      </div>
      {activeEvent?.buildingId === building.id && (
        <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-100">
          Active evacuation started at {new Date(activeEvent.triggeredAt).toLocaleTimeString()}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
          <h2 className="text-xl font-black text-white">Floor Plan</h2>
          <div className="mt-5 grid h-96 grid-cols-4 grid-rows-4 gap-3 rounded-2xl bg-navy p-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
          <h2 className="text-xl font-black text-white">Add Exit</h2>
          <input
            className="mt-5 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          <input
            className="mt-3 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white"
            value={floor}
            onChange={(event) => setFloor(event.target.value)}
            type="number"
          />
          <button onClick={addExit} className="mt-4 w-full rounded-xl bg-blue px-4 py-3 font-black text-white">
            Add Exit
          </button>
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 bg-[#10213A] p-6">
        <h2 className="text-xl font-black text-white">Marked Exits</h2>
        <div className="mt-4 space-y-3">
          {building.exits.map((exit) => (
            <div key={exit.id} className="flex items-center justify-between rounded-2xl bg-navy p-4 text-slate-200">
              <span className="font-bold text-white">{exit.label}</span>
              <span>
                Floor {exit.floor} · {exit.lat.toFixed(5)}, {exit.lng.toFixed(5)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
