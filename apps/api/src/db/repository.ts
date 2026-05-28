import { buildings as seededBuildings, evacuationEvents as seededEvents, exits as seededExits } from "@waypoint/mock-data";
import type { Building, EvacuationEvent, Exit, User } from "@waypoint/types";
import { mapBuilding, mapEvent, mapExit, mapProfile } from "./mappers.js";
import { supabaseAdmin } from "./supabase.js";

export interface Repository {
  getUser(userId: string): Promise<User | null>;
  listBuildings(user: User): Promise<Building[]>;
  listExits(buildingId: string, user: User): Promise<Exit[]>;
  createExit(buildingId: string, input: Pick<Exit, "lat" | "lng" | "floor" | "label">, user: User): Promise<Exit>;
  triggerEvacuation(buildingId: string, user: User): Promise<EvacuationEvent>;
  listEvents(user: User): Promise<EvacuationEvent[]>;
  getEvent(eventId: string, user: User): Promise<EvacuationEvent | null>;
}

let mockExits: Exit[] = [...seededExits];
let mockEvents: EvacuationEvent[] = [...seededEvents];

const canManageBuilding = (user: User, buildingId: string) => {
  return (user.role === "admin" || user.role === "manager") && user.buildingIds.includes(buildingId);
};

const assertCanAccessBuilding = (user: User, buildingId: string) => {
  if (!user.buildingIds.includes(buildingId)) {
    throw new Error("Forbidden");
  }
};

const assertCanManageBuilding = (user: User, buildingId: string) => {
  if (!canManageBuilding(user, buildingId)) {
    throw new Error("Forbidden");
  }
};

export const mockRepository: Repository = {
  async getUser(userId) {
    return {
      id: userId,
      email: "admin@waypoint.app",
      fullName: "Waypoint Pilot Admin",
      role: "admin",
      buildingIds: seededBuildings.map((building) => building.id),
      organizationIds: ["org-demo"]
    };
  },
  async listBuildings(user) {
    return seededBuildings
      .filter((building) => user.buildingIds.includes(building.id))
      .map((building) => ({ ...building, exits: mockExits.filter((exit) => exit.buildingId === building.id) }));
  },
  async listExits(buildingId, user) {
    assertCanAccessBuilding(user, buildingId);
    return mockExits.filter((exit) => exit.buildingId === buildingId);
  },
  async createExit(buildingId, input, user) {
    assertCanManageBuilding(user, buildingId);
    const exit: Exit = {
      id: `exit-${buildingId}-${Date.now()}`,
      buildingId,
      floor: input.floor,
      lat: input.lat,
      lng: input.lng,
      label: input.label,
      createdBy: user.id
    };
    mockExits = [...mockExits, exit];
    return exit;
  },
  async triggerEvacuation(buildingId, user) {
    assertCanManageBuilding(user, buildingId);
    const building = seededBuildings.find((item) => item.id === buildingId);
    if (!building) {
      throw new Error("Not found");
    }

    const event: EvacuationEvent = {
      id: `event-${Date.now()}`,
      buildingId,
      triggeredAt: new Date().toISOString(),
      resolvedAt: null,
      userCount: Math.max(25, Math.round((building.employeeCount ?? building.floors * 110) + Math.random() * 40))
    };
    mockEvents = [event, ...mockEvents];
    return event;
  },
  async listEvents(user) {
    return mockEvents.filter((event) => user.buildingIds.includes(event.buildingId));
  },
  async getEvent(eventId, user) {
    return mockEvents.find((event) => event.id === eventId && user.buildingIds.includes(event.buildingId)) ?? null;
  }
};

export const supabaseRepository: Repository = {
  async getUser(userId) {
    if (!supabaseAdmin) {
      return null;
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id,email,full_name,role,building_assignments(building_id),memberships(organization_id)")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return mapProfile(data);
  },
  async listBuildings(user) {
    if (!supabaseAdmin) {
      return [];
    }

    const { data, error } = await supabaseAdmin
      .from("buildings")
      .select("id,organization_id,name,address,floors,employee_count,exits(id,building_id,floor,lat,lng,label,created_by)")
      .in("id", user.buildingIds)
      .order("name");

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapBuilding);
  },
  async listExits(buildingId, user) {
    assertCanAccessBuilding(user, buildingId);
    if (!supabaseAdmin) {
      return [];
    }

    const { data, error } = await supabaseAdmin.from("exits").select("id,building_id,floor,lat,lng,label,created_by").eq("building_id", buildingId);
    if (error) {
      throw error;
    }

    return (data ?? []).map(mapExit);
  },
  async createExit(buildingId, input, user) {
    assertCanManageBuilding(user, buildingId);
    if (!supabaseAdmin) {
      throw new Error("Supabase not configured");
    }

    const { data, error } = await supabaseAdmin
      .from("exits")
      .insert({
        building_id: buildingId,
        floor: input.floor,
        lat: input.lat,
        lng: input.lng,
        label: input.label,
        created_by: user.id
      })
      .select("id,building_id,floor,lat,lng,label,created_by")
      .single();

    if (error) {
      throw error;
    }

    return mapExit(data);
  },
  async triggerEvacuation(buildingId, user) {
    assertCanManageBuilding(user, buildingId);
    if (!supabaseAdmin) {
      throw new Error("Supabase not configured");
    }

    const { data: building, error: buildingError } = await supabaseAdmin.from("buildings").select("employee_count").eq("id", buildingId).single();
    if (buildingError) {
      throw buildingError;
    }

    const { data, error } = await supabaseAdmin
      .from("evacuation_events")
      .insert({
        building_id: buildingId,
        triggered_by: user.id,
        user_count: building?.employee_count ?? 0,
        status: "active"
      })
      .select("id,building_id,triggered_at,resolved_at,user_count")
      .single();

    if (error) {
      throw error;
    }

    return mapEvent(data);
  },
  async listEvents(user) {
    if (!supabaseAdmin) {
      return [];
    }

    const { data, error } = await supabaseAdmin
      .from("evacuation_events")
      .select("id,building_id,triggered_at,resolved_at,user_count")
      .in("building_id", user.buildingIds)
      .order("triggered_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapEvent);
  },
  async getEvent(eventId, user) {
    if (!supabaseAdmin) {
      return null;
    }

    const { data, error } = await supabaseAdmin
      .from("evacuation_events")
      .select("id,building_id,triggered_at,resolved_at,user_count")
      .eq("id", eventId)
      .single();

    if (error || !data || !user.buildingIds.includes(data.building_id)) {
      return null;
    }

    return mapEvent(data);
  }
};
