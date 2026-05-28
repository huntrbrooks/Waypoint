import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "@/navigation/types";
import { triggerEvacuation } from "@/data/api";
import { useEvacuationState } from "@/hooks/useEvacuationState";
import { useAuth } from "@/lib/auth";
import { useWaypointStore } from "@/store/useWaypointStore";

type Props = BottomTabScreenProps<RootTabParamList, "Home">;

export const HomeScreen = ({ navigation }: Props) => {
  const buildings = useWaypointStore((state) => state.buildings);
  const selectedBuildingId = useWaypointStore((state) => state.selectedBuildingId);
  const localDrill = useWaypointStore((state) => state.triggerDrill);
  const setActiveEvent = useWaypointStore((state) => state.setActiveEvent);
  const activeEvent = useEvacuationState();
  const { session } = useAuth();
  const building = buildings.find((item) => item.id === selectedBuildingId) ?? buildings[0];
  const isActive = activeEvent?.buildingId === building.id;

  const handleEvacuate = async () => {
    try {
      const event = await triggerEvacuation(building.id, session?.access_token ?? "");
      setActiveEvent(event);
    } catch {
      const fallbackEvent = localDrill();
      setActiveEvent(fallbackEvent);
      Alert.alert("Drill mode active", "API unavailable, so Waypoint started a local evacuation drill.");
    }

    navigation.navigate("Navigator");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>WAYPOINT</Text>
      <Text style={styles.slogan}>Know Your Way. Know You're Safe.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Assigned Building</Text>
        <Text style={styles.building}>{building.name}</Text>
        <Text style={[styles.status, isActive ? styles.statusActive : styles.statusNormal]}>
          {isActive ? "EVACUATION ACTIVE" : "NORMAL OPERATIONS"}
        </Text>
      </View>
      <Pressable style={styles.cta} onPress={handleEvacuate}>
        <Text style={styles.ctaText}>EVACUATE NOW</Text>
      </Pressable>
      <Text style={styles.note}>Drill mode points your phone toward the nearest marked exit in real time.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1628",
    padding: 24,
    justifyContent: "center"
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 4
  },
  slogan: {
    color: "#8FB7FF",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 40
  },
  card: {
    backgroundColor: "#10213A",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1E6FFF"
  },
  label: {
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12
  },
  building: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 8
  },
  status: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "800"
  },
  statusNormal: {
    color: "#22C55E"
  },
  statusActive: {
    color: "#EF4444"
  },
  cta: {
    backgroundColor: "#22C55E",
    borderRadius: 999,
    paddingVertical: 22,
    alignItems: "center",
    marginTop: 40
  },
  ctaText: {
    color: "#07111F",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1
  },
  note: {
    color: "#D1D5DB",
    marginTop: 24,
    lineHeight: 22
  }
});
