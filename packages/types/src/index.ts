export interface Exit {
  id: string;
  buildingId: string;
  floor: number;
  lat: number;
  lng: number;
  label: string;
  createdBy?: string | null;
}

export interface Building {
  id: string;
  organizationId?: string;
  name: string;
  address: string;
  floors: number;
  employeeCount?: number;
  exits: Exit[];
}

export interface EvacuationEvent {
  id: string;
  buildingId: string;
  triggeredAt: string;
  resolvedAt: string | null;
  userCount: number;
}

export interface User {
  id: string;
  email?: string;
  fullName?: string | null;
  role: "admin" | "manager" | "employee";
  buildingIds: string[];
  organizationIds?: string[];
}

export interface CompassReading {
  heading: number;
  accuracy: number;
  timestamp: number;
}

export type EvacuationStatus = "normal" | "active";

export interface EvacuationStateMessage {
  type: "evacuation_triggered" | "evacuation_resolved";
  event: EvacuationEvent;
}

export interface Organization {
  id: string;
  name: string;
  planTier: "core" | "professional" | "enterprise" | string;
  billingContactEmail?: string | null;
}

export interface AuthenticatedUser extends User {
  accessToken: string;
}
