import { useMemo } from "react";
import type { Exit } from "@waypoint/types";
import { nearestExit, type Coordinate } from "@/utils/geo";

export const useNearestExit = (position: Coordinate | null, exits: Exit[]) => {
  return useMemo(() => {
    if (!position || exits.length === 0) {
      return null;
    }

    return nearestExit(position, exits);
  }, [exits, position]);
};
