import type { Building, EvacuationEvent, Exit, User } from "@waypoint/types";

interface ExitRow {
  id: string;
  building_id: string;
  floor: number;
  lat: number;
  lng: number;
  label: string;
  created_by: string | null;
}

interface BuildingRow {
  id: string;
  organization_id: string;
  name: string;
  address: string;
  floors: number;
  employee_count: number;
  exits?: ExitRow[];
}

interface EventRow {
  id: string;
  building_id: string;
  triggered_at: string;
  resolved_at: string | null;
  user_count: number;
}

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: User["role"];
  building_assignments?: Array<{ building_id: string }>;
  memberships?: Array<{ organization_id: string }>;
}

export const mapExit = (row: ExitRow): Exit => ({
  id: row.id,
  buildingId: row.building_id,
  floor: row.floor,
  lat: row.lat,
  lng: row.lng,
  label: row.label,
  createdBy: row.created_by
});

export const mapBuilding = (row: BuildingRow): Building => ({
  id: row.id,
  organizationId: row.organization_id,
  name: row.name,
  address: row.address,
  floors: row.floors,
  employeeCount: row.employee_count,
  exits: (row.exits ?? []).map(mapExit)
});

export const mapEvent = (row: EventRow): EvacuationEvent => ({
  id: row.id,
  buildingId: row.building_id,
  triggeredAt: row.triggered_at,
  resolvedAt: row.resolved_at,
  userCount: row.user_count
});

export const mapProfile = (row: ProfileRow): User => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  role: row.role,
  buildingIds: (row.building_assignments ?? []).map((assignment) => assignment.building_id),
  organizationIds: (row.memberships ?? []).map((membership) => membership.organization_id)
});
