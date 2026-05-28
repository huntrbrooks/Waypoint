import { StyleSheet, Text, View } from "react-native";
import { useBearing } from "@/hooks/useBearing";
import { useCompass } from "@/hooks/useCompass";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useNearestExit } from "@/hooks/useNearestExit";
import { useWaypointStore } from "@/store/useWaypointStore";

const fallbackPosition = { lat: 40.758, lng: -73.9858 };

export const NavigatorScreen = () => {
  const compass = useCompass();
  const { position, error } = useCurrentLocation();
  const buildings = useWaypointStore((state) => state.buildings);
  const selectedBuildingId = useWaypointStore((state) => state.selectedBuildingId);
  const activeEvent = useWaypointStore((state) => state.activeEvent);
  const building = buildings.find((item) => item.id === selectedBuildingId) ?? buildings[0];
  const navigationPosition = position ?? fallbackPosition;
  const nearest = useNearestExit(navigationPosition, building.exits);
  const target = nearest ? { lat: nearest.exit.lat, lng: nearest.exit.lng } : null;
  const { rotation, bearing } = useBearing(navigationPosition, target, compass.heading);
  const emergencyColor = activeEvent ? "#EF4444" : nearest && nearest.distance < 80 ? "#22C55E" : "#F59E0B";

  return (
    <View style={[styles.container, { backgroundColor: activeEvent ? "#210B12" : "#0A1628" }]}>
      <Text style={styles.status}>{activeEvent ? "EMERGENCY ROUTE ACTIVE" : "NAVIGATION READY"}</Text>
      <View style={styles.compassRing}>
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={[styles.arrow, { shadowColor: emergencyColor, transform: [{ rotate: `${rotation}deg` }] }]}
        >
          <View style={[styles.arrowHead, { borderBottomColor: emergencyColor }]} />
          <View style={[styles.arrowTail, { backgroundColor: emergencyColor }]} />
          <View style={styles.arrowHighlight} />
        </View>
      </View>
      <Text style={styles.exitLabel}>{nearest?.exit.label ?? "No exit marked"}</Text>
      <Text style={styles.distance}>{nearest ? `${Math.round(nearest.distance)} m` : "-- m"}</Text>
      <Text style={styles.detail}>Bearing {Math.round(bearing)}° · Heading {Math.round(compass.heading)}°</Text>
      <Text style={styles.detail}>Compass signal {compass.accuracy}% · Floor {nearest?.exit.floor ?? "-"}</Text>
      <Text style={styles.warning}>{error ?? "Keep moving calmly toward the arrow."}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  status: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 32
  },
  compassRing: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: "#1E6FFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10213A"
  },
  arrow: {
    width: 116,
    height: 158,
    alignItems: "center",
    justifyContent: "flex-start",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  },
  arrowHead: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 58,
    borderRightWidth: 58,
    borderBottomWidth: 116,
    borderLeftColor: "transparent",
    borderRightColor: "transparent"
  },
  arrowTail: {
    position: "absolute",
    top: 72,
    width: 34,
    height: 78,
    borderRadius: 20
  },
  arrowHighlight: {
    position: "absolute",
    top: 88,
    width: 10,
    height: 46,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.24)"
  },
  exitLabel: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 36,
    textAlign: "center"
  },
  distance: {
    color: "#1E6FFF",
    fontSize: 56,
    fontWeight: "900",
    marginTop: 8
  },
  detail: {
    color: "#CBD5E1",
    marginTop: 8
  },
  warning: {
    color: "#F8FAFC",
    marginTop: 28,
    textAlign: "center",
    lineHeight: 22
  }
});
