import { useEffect, useState } from "react";
import * as Location from "expo-location";
import type { Coordinate } from "@/utils/geo";

export const useCurrentLocation = () => {
  const [position, setPosition] = useState<Coordinate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const start = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setError("Location permission is required for evacuation navigation.");
        return;
      }

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setPosition({ lat: current.coords.latitude, lng: current.coords.longitude });

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 2 },
        (location) => setPosition({ lat: location.coords.latitude, lng: location.coords.longitude })
      );
    };

    void start();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { position, error };
};
