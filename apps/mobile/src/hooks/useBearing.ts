import { useMemo } from "react";
import { bearingDegrees, normalizeDegrees, type Coordinate } from "@/utils/geo";

export const useBearing = (position: Coordinate | null, target: Coordinate | null, heading: number) => {
  return useMemo(() => {
    if (!position || !target) {
      return { bearing: 0, rotation: 0 };
    }

    const bearing = bearingDegrees(position, target);
    return { bearing, rotation: normalizeDegrees(bearing - heading) };
  }, [heading, position, target]);
};
