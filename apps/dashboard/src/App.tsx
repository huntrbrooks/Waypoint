import { useEffect, useMemo, useState } from "react";
import { buildings as seededBuildings, evacuationEvents } from "@waypoint/mock-data";
import type { Building, EvacuationEvent, EvacuationStateMessage, Exit } from "@waypoint/types";
import { Sidebar, type DashboardView } from "./components/Sidebar";
import { createExit, getBuildings, getEvents, getWsUrl, triggerEvacuation } from "./data/api";
import { AuthProvider, useAuth } from "./lib/auth";
import { Analytics } from "./pages/Analytics";
import { BuildingDetail } from "./pages/BuildingDetail";
import { BuildingsList } from "./pages/BuildingsList";
import { EvacuationMonitor } from "./pages/EvacuationMonitor";
import { LoginPage } from "./pages/LoginPage";
import { Settings } from "./pages/Settings";

const isEvacuationMessage = (payload: unknown): payload is EvacuationStateMessage => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "type" in payload &&
    (payload as { type: string }).type === "evacuation_triggered" &&
    "event" in payload
  );
};

const DashboardApp = () => {
  const { initialized, session, signIn, signOut } = useAuth();
  const [view, setView] = useState<DashboardView>("buildings");
  const [buildings, setBuildings] = useState<Building[]>(seededBuildings);
  const [selectedBuildingId, setSelectedBuildingId] = useState(seededBuildings[0]?.id ?? "");
  const [activeEvent, setActiveEvent] = useState<EvacuationEvent | null>(null);
  const [events, setEvents] = useState<EvacuationEvent[]>(evacuationEvents);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const token = session?.access_token ?? "";

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoadingData(true);
    setError("");
    void Promise.all([getBuildings(token), getEvents(token)])
      .then(([nextBuildings, nextEvents]) => {
        setBuildings(nextBuildings);
        setEvents(nextEvents);
        setSelectedBuildingId(nextBuildings[0]?.id ?? "");
      })
      .catch(() => {
        setError("Unable to load Waypoint data. Check the API service and your session, then try again.");
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = new WebSocket(getWsUrl(token));
    socket.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data) as unknown;
        if (!isEvacuationMessage(payload)) {
          return;
        }

        if (payload.type === "evacuation_triggered") {
          setActiveEvent(payload.event);
          setEvents((current) => [payload.event, ...current]);
        }
      } catch {
        return;
      }
    };

    return () => socket.close();
  }, [token]);

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId) ?? buildings[0],
    [buildings, selectedBuildingId]
  );

  const handleAddExit = async (input: Pick<Exit, "lat" | "lng" | "floor" | "label">) => {
    if (!selectedBuilding) {
      return;
    }

    try {
      const exit = await createExit(selectedBuilding.id, input, token);
      setBuildings((current) => current.map((building) => (building.id === exit.buildingId ? { ...building, exits: [...building.exits, exit] } : building)));
      setError("");
    } catch {
      setError("Unable to add this exit. Check the values and try again.");
    }
  };

  const handleTrigger = async () => {
    if (!selectedBuilding) {
      return;
    }

    try {
      const event = await triggerEvacuation(selectedBuilding.id, token);
      setActiveEvent(event);
      setEvents((current) => [event, ...current]);
      setView("monitor");
      setError("");
    } catch {
      setError("Unable to trigger evacuation. Check the API service and try again.");
    }
  };

  if (!initialized) {
    return <main className="flex min-h-dvh items-center justify-center bg-navy px-4 text-center text-white">Loading Waypoint command...</main>;
  }

  if (!session) {
    return <LoginPage onLogin={signIn} />;
  }

  return (
    <div className="min-h-dvh bg-navy text-white lg:flex">
      <Sidebar currentView={view} onChange={setView} onSignOut={signOut} />
      <main className="w-full flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-7xl">
          {error && <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-100">{error}</div>}
          {loadingData && <div className="mb-6 rounded-2xl border border-blue/30 bg-blue/10 p-4 text-blue-100">Loading live Waypoint data...</div>}
          {!selectedBuilding && !loadingData && (
            <div className="rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:p-8">
              <h1 className="text-2xl font-black text-white sm:text-3xl">No buildings available</h1>
              <p className="mt-2 text-slate-300">Your account is not assigned to any buildings yet.</p>
            </div>
          )}
          {selectedBuilding && (
            <>
              {view === "buildings" && (
                <BuildingsList
                  buildings={buildings}
                  activeEvent={activeEvent}
                  selectedBuildingId={selectedBuilding.id}
                  onSelect={(buildingId) => {
                    setSelectedBuildingId(buildingId);
                    setView("detail");
                  }}
                />
              )}
              {view === "detail" && (
                <BuildingDetail building={selectedBuilding} activeEvent={activeEvent} onAddExit={handleAddExit} onTrigger={handleTrigger} />
              )}
              {view === "monitor" && <EvacuationMonitor activeEvent={activeEvent} building={selectedBuilding} />}
              {view === "analytics" && <Analytics buildings={buildings} events={events} />}
              {view === "settings" && <Settings />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export const App = () => (
  <AuthProvider>
    <DashboardApp />
  </AuthProvider>
);
