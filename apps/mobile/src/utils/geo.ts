import type { Exit } from "@waypoint/types";

export interface Coordinate {
  lat: number;
  lng: number;
}

const earthRadiusMeters = 6371000;

const toRadians = (value: number) => (value * Math.PI) / 180;
const toDegrees = (value: number) => (value * 180) / Math.PI;

export const normalizeDegrees = (value: number) => ((value % 360) + 360) % 360;

export const distanceMeters = (from: Coordinate, to: Coordinate) => {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const bearingDegrees = (from: Coordinate, to: Coordinate) => {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLng = toRadians(to.lng - from.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
};

export const nearestExit = (position: Coordinate, exits: Exit[]) => {
  return exits.reduce<{ exit: Exit; distance: number } | null>((closest, exit) => {
    const distance = distanceMeters(position, { lat: exit.lat, lng: exit.lng });
    if (!closest || distance < closest.distance) {
      return { exit, distance };
    }

    return closest;
  }, null);
};
