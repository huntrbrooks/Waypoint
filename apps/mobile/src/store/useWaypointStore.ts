import { create } from "zustand";
import { buildings, evacuationEvents } from "@waypoint/mock-data";
import type { Building, EvacuationEvent, Exit, User } from "@waypoint/types";

interface WaypointState {
  user: User;
  buildings: Building[];
  selectedBuildingId: string;
  activeEvent: EvacuationEvent | null;
  setUser: (user: User) => void;
  setBuildings: (buildings: Building[]) => void;
  setSelectedBuildingId: (buildingId: string) => void;
  setActiveEvent: (event: EvacuationEvent | null) => void;
  triggerDrill: () => EvacuationEvent;
  addExit: (exit: Exit) => void;
}

const defaultUser: User = {
  id: "user-demo-manager",
  role: "manager",
  buildingIds: buildings.map((building) => building.id)
};

export const useWaypointStore = create<WaypointState>((set, get) => ({
  user: defaultUser,
  buildings,
  selectedBuildingId: buildings[0]?.id ?? "",
  activeEvent: evacuationEvents.find((event) => event.resolvedAt === null) ?? null,
  setUser: (user) => set({ user }),
  setBuildings: (nextBuildings) =>
    set((state) => ({
      buildings: nextBuildings,
      selectedBuildingId: nextBuildings.some((building) => building.id === state.selectedBuildingId)
        ? state.selectedBuildingId
        : nextBuildings[0]?.id ?? ""
    })),
  setSelectedBuildingId: (buildingId) => set({ selectedBuildingId: buildingId }),
  setActiveEvent: (event) => set({ activeEvent: event }),
  triggerDrill: () => {
    const selectedBuildingId = get().selectedBuildingId;
    const event: EvacuationEvent = {
      id: `local-event-${Date.now()}`,
      buildingId: selectedBuildingId,
      triggeredAt: new Date().toISOString(),
      resolvedAt: null,
      userCount: 120
    };

    set({ activeEvent: event });
    return event;
  },
  addExit: (exit) =>
    set((state) => ({
      buildings: state.buildings.map((building) =>
        building.id === exit.buildingId ? { ...building, exits: [...building.exits, exit] } : building
      )
    }))
}));
