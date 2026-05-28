import { useEffect, useState } from "react";
import type { Building, EvacuationEvent, Exit } from "@waypoint/types";

interface BuildingDetailProps {
  building: Building;
  activeEvent: EvacuationEvent | null;
  onAddExit: (input: Pick<Exit, "lat" | "lng" | "floor" | "label">) => Promise<void>;
  onTrigger: () => Promise<void>;
}

export const BuildingDetail = ({ building, activeEvent, onAddExit, onTrigger }: BuildingDetailProps) => {
  const [label, setLabel] = useState("Manual Exit");
  const [floor, setFloor] = useState("1");
  const [lat, setLat] = useState(String(building.exits[0]?.lat ?? ""));
  const [lng, setLng] = useState(String(building.exits[0]?.lng ?? ""));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLat(String(building.exits[0]?.lat ?? ""));
    setLng(String(building.exits[0]?.lng ?? ""));
  }, [building.id, building.exits]);

  const addExit = async () => {
    setSubmitting(true);
    try {
      await onAddExit({
        floor: Number(floor) || 1,
        lat: Number(lat),
        lng: Number(lng),
        label: label.trim()
      });
      setLabel("Manual Exit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">{building.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">{building.address}</p>
        </div>
        <button
          onClick={() => void onTrigger()}
          className="min-h-11 w-full rounded-xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 md:w-auto"
        >
          Trigger Evacuation
        </button>
      </div>
      {activeEvent?.buildingId === building.id && (
        <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-100">
          Active evacuation started at {new Date(activeEvent.triggeredAt).toLocaleTimeString()}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-4 sm:p-6">
          <h2 className="text-xl font-black text-white">Floor Plan</h2>
          <div className="mt-5 grid aspect-square max-h-[28rem] min-h-64 grid-cols-4 grid-rows-4 gap-2 rounded-2xl bg-navy p-3 sm:gap-3 sm:p-4 lg:aspect-auto lg:h-96">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-4 sm:p-6">
          <h2 className="text-xl font-black text-white">Add Exit</h2>
          <label className="mt-5 block text-sm font-bold text-slate-300" htmlFor="exit-label">
            Exit label
          </label>
          <input
            id="exit-label"
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-base text-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/50"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          <label className="mt-3 block text-sm font-bold text-slate-300" htmlFor="exit-floor">
            Floor
          </label>
          <input
            id="exit-floor"
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-base text-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/50"
            value={floor}
            onChange={(event) => setFloor(event.target.value)}
            type="number"
          />
          <label className="mt-3 block text-sm font-bold text-slate-300" htmlFor="exit-lat">
            Latitude
          </label>
          <input
            id="exit-lat"
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-base text-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/50"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            type="number"
            step="any"
            placeholder="Latitude"
          />
          <label className="mt-3 block text-sm font-bold text-slate-300" htmlFor="exit-lng">
            Longitude
          </label>
          <input
            id="exit-lng"
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-base text-white outline-none focus:border-blue focus:ring-2 focus:ring-blue/50"
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            type="number"
            step="any"
            placeholder="Longitude"
          />
          <button
            disabled={submitting}
            onClick={() => void addExit()}
            className="mt-4 min-h-11 w-full rounded-xl bg-blue px-4 py-3 font-black text-white focus:outline-none focus:ring-2 focus:ring-blue/50 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Exit"}
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-[#10213A] p-4 sm:mt-6 sm:p-6">
        <h2 className="text-xl font-black text-white">Marked Exits</h2>
        <div className="mt-4 space-y-3">
          {building.exits.map((exit) => (
            <div key={exit.id} className="flex flex-col gap-2 rounded-2xl bg-navy p-4 text-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-bold text-white">{exit.label}</span>
              <span className="break-words text-sm sm:text-right sm:text-base">
                Floor {exit.floor} · {exit.lat.toFixed(5)}, {exit.lng.toFixed(5)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
