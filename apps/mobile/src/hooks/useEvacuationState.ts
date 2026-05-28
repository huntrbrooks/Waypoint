import { useEffect } from "react";
import type { EvacuationStateMessage } from "@waypoint/types";
import { evacuationSocketUrl } from "@/data/api";
import { useWaypointStore } from "@/store/useWaypointStore";

const isEvacuationMessage = (payload: unknown): payload is EvacuationStateMessage => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "type" in payload &&
    ((payload as { type: string }).type === "evacuation_triggered" || (payload as { type: string }).type === "evacuation_resolved") &&
    "event" in payload
  );
};

export const useEvacuationState = () => {
  const activeEvent = useWaypointStore((state) => state.activeEvent);
  const setActiveEvent = useWaypointStore((state) => state.setActiveEvent);

  useEffect(() => {
    const socket = new WebSocket(evacuationSocketUrl);

    socket.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data) as unknown;
        if (!isEvacuationMessage(payload)) {
          return;
        }

        if (payload.type === "evacuation_triggered") {
          setActiveEvent(payload.event);
        }
        if (payload.type === "evacuation_resolved") {
          setActiveEvent(null);
        }
      } catch {
        return;
      }
    };

    return () => socket.close();
  }, [setActiveEvent]);

  return activeEvent;
};
