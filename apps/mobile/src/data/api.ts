import type { Building, EvacuationEvent, Exit, User } from "@waypoint/types";

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

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

export const triggerEvacuation = async (buildingId: string, token: string): Promise<EvacuationEvent> =>
  request<EvacuationEvent>(`/buildings/${buildingId}/evacuate`, token, { method: "POST" });

export const createExit = async (
  buildingId: string,
  payload: Pick<Exit, "lat" | "lng" | "floor" | "label">,
  token: string
): Promise<Exit> => {
  return request<Exit>(`/buildings/${buildingId}/exits`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const evacuationSocketUrl = apiUrl.replace(/^http/, "ws") + "/ws";
