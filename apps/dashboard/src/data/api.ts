import type { Building, EvacuationEvent, Exit, User } from "@waypoint/types";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const request = async <T>(path: string, token: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Waypoint API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

export const getMe = async (token: string) => request<User>("/me", token);

export const getBuildings = async (token: string) => request<Building[]>("/buildings", token);

export const getEvents = async (token: string) => request<EvacuationEvent[]>("/events", token);

export const createExit = async (buildingId: string, payload: Pick<Exit, "lat" | "lng" | "floor" | "label">, token: string) => {
  return request<Exit>(`/buildings/${buildingId}/exits`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const triggerEvacuation = async (buildingId: string, token: string): Promise<EvacuationEvent> => {
  return request<EvacuationEvent>(`/buildings/${buildingId}/evacuate`, token, { method: "POST" });
};

const wsUrl = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001/ws";

export const getWsUrl = (token: string) => {
  const separator = wsUrl.includes("?") ? "&" : "?";
  return `${wsUrl}${separator}token=${encodeURIComponent(token)}`;
};
