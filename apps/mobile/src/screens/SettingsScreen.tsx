import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/lib/auth";
import { useWaypointStore } from "@/store/useWaypointStore";

export const SettingsScreen = () => {
  const user = useWaypointStore((state) => state.user);
  const buildings = useWaypointStore((state) => state.buildings);
  const selectedBuildingId = useWaypointStore((state) => state.selectedBuildingId);
  const setSelectedBuildingId = useWaypointStore((state) => state.setSelectedBuildingId);
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Building selector</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={selectedBuildingId} onValueChange={setSelectedBuildingId} dropdownIconColor="#FFFFFF" style={styles.picker}>
          {buildings.map((building) => (
            <Picker.Item key={building.id} label={building.name} value={building.id} />
          ))}
        </Picker>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>User role</Text>
        <Text style={styles.cardValue}>{user.role.toUpperCase()}</Text>
      </View>
      <Pressable
        style={styles.logout}
        onPress={() => {
          void signOut().then(() => Alert.alert("Logged out", "Your Waypoint session has ended."));
        }}
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </Pressable>
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
    fontWeight: "900",
    marginBottom: 32
  },
  label: {
    color: "#94A3B8",
    marginBottom: 8,
    fontWeight: "700"
  },
  pickerWrap: {
    backgroundColor: "#10213A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E6FFF",
    overflow: "hidden"
  },
  picker: {
    color: "#FFFFFF"
  },
  card: {
    backgroundColor: "#10213A",
    borderRadius: 20,
    padding: 20,
    marginTop: 24
  },
  cardLabel: {
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 8
  },
  logout: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32
  },
  logoutText: {
    color: "#FCA5A5",
    fontWeight: "900"
  }
});
