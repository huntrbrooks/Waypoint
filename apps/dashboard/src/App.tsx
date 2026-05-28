import { useEffect, useMemo, useState } from "react";
import { buildings as seededBuildings, evacuationEvents } from "@waypoint/mock-data";
import type { Building, EvacuationEvent, EvacuationStateMessage, Exit } from "@waypoint/types";
import { Sidebar, type DashboardView } from "./components/Sidebar";
import { createExit, getBuildings, getEvents, triggerEvacuation, wsUrl } from "./data/api";
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
  const token = session?.access_token ?? "";

  useEffect(() => {
    if (!token) {
      return;
    }

    void Promise.all([getBuildings(token), getEvents(token)]).then(([nextBuildings, nextEvents]) => {
      setBuildings(nextBuildings);
      setEvents(nextEvents);
      setSelectedBuildingId(nextBuildings[0]?.id ?? "");
    });
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = new WebSocket(wsUrl);
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
    const exit = await createExit(selectedBuilding.id, input, token);
    setBuildings((current) => current.map((building) => (building.id === exit.buildingId ? { ...building, exits: [...building.exits, exit] } : building)));
  };

  const handleTrigger = async () => {
    const event = await triggerEvacuation(selectedBuilding.id, token);
    setActiveEvent(event);
    setEvents((current) => [event, ...current]);
    setView("monitor");
  };

  if (!initialized) {
    return <main className="flex min-h-screen items-center justify-center bg-navy text-white">Loading Waypoint command...</main>;
  }

  if (!session) {
    return <LoginPage onLogin={signIn} />;
  }

  return (
    <div className="flex min-h-screen bg-navy text-white">
      <Sidebar currentView={view} onChange={setView} onSignOut={signOut} />
      <main className="flex-1 overflow-y-auto p-8">
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
      </main>
    </div>
  );
};

export const App = () => (
  <AuthProvider>
    <DashboardApp />
  </AuthProvider>
);
