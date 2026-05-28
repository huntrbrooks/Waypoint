import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Location from "expo-location";
import { useState } from "react";
import { createExit } from "@/data/api";
import { useAuth } from "@/lib/auth";
import { useWaypointStore } from "@/store/useWaypointStore";

export const ExitMarkerScreen = () => {
  const [label, setLabel] = useState("New Emergency Exit");
  const [floor, setFloor] = useState("1");
  const user = useWaypointStore((state) => state.user);
  const buildings = useWaypointStore((state) => state.buildings);
  const selectedBuildingId = useWaypointStore((state) => state.selectedBuildingId);
  const addExit = useWaypointStore((state) => state.addExit);
  const { session } = useAuth();
  const building = buildings.find((item) => item.id === selectedBuildingId) ?? buildings[0];
  const canMarkExit = user.role === "admin" || user.role === "manager";

  const handleMarkExit = async () => {
    if (!canMarkExit) {
      Alert.alert("Manager access required", "Only managers and admins can mark exit coordinates.");
      return;
    }

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Location blocked", "Enable location access to mark an exit.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const payload = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      floor: Number(floor) || 1,
      label: label.trim() || "Emergency Exit"
    };

    try {
      const exit = await createExit(building.id, payload, session?.access_token ?? "");
      addExit(exit);
      Alert.alert("Exit saved", `${exit.label} was added to ${building.name}.`);
    } catch {
      const localExit = {
        id: `local-exit-${Date.now()}`,
        buildingId: building.id,
        ...payload
      };
      addExit(localExit);
      Alert.alert("Exit saved locally", "API unavailable, so this marker was saved in the local demo state.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Exit</Text>
      <Text style={styles.copy}>Capture the current GPS coordinate as an emergency exit for {building.name}.</Text>
      <Text style={styles.label}>Exit label</Text>
      <TextInput value={label} onChangeText={setLabel} style={styles.input} placeholderTextColor="#64748B" />
      <Text style={styles.label}>Floor</Text>
      <TextInput value={floor} onChangeText={setFloor} style={styles.input} keyboardType="number-pad" placeholderTextColor="#64748B" />
      <Pressable style={[styles.button, !canMarkExit && styles.buttonDisabled]} onPress={handleMarkExit}>
        <Text style={styles.buttonText}>MARK EXIT HERE</Text>
      </Pressable>
      <Text style={styles.role}>Signed in role: {user.role}</Text>
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
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900"
  },
  copy: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 24
  },
  label: {
    color: "#94A3B8",
    marginBottom: 8,
    fontWeight: "700"
  },
  input: {
    backgroundColor: "#10213A",
    color: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E6FFF",
    marginBottom: 16
  },
  button: {
    backgroundColor: "#1E6FFF",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 16
  },
  buttonDisabled: {
    backgroundColor: "#334155"
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 1
  },
  role: {
    color: "#94A3B8",
    marginTop: 20
  }
});
