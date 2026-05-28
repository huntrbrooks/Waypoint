import { useEffect, useState } from "react";
import { Magnetometer } from "expo-sensors";
import type { CompassReading } from "@waypoint/types";
import { normalizeDegrees } from "@/utils/geo";

export const useCompass = () => {
  const [reading, setReading] = useState<CompassReading>({
    heading: 0,
    accuracy: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    Magnetometer.setUpdateInterval(250);
    const subscription = Magnetometer.addListener(({ x, y, z }) => {
      const heading = normalizeDegrees(Math.atan2(y, x) * (180 / Math.PI));
      const accuracy = Math.min(100, Math.round(Math.sqrt(x * x + y * y + z * z) * 10));

      setReading({ heading, accuracy, timestamp: Date.now() });
    });

    return () => subscription.remove();
  }, []);

  return reading;
};
