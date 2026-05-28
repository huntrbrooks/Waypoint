import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthGate } from "@/components/AuthGate";
import { getBuildings, getMe } from "@/data/api";
import { AuthProvider, useAuth } from "@/lib/auth";
import { HomeScreen } from "@/screens/HomeScreen";
import { NavigatorScreen } from "@/screens/NavigatorScreen";
import { ExitMarkerScreen } from "@/screens/ExitMarkerScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import type { RootTabParamList } from "@/navigation/types";
import { useWaypointStore } from "@/store/useWaypointStore";

const Tab = createBottomTabNavigator<RootTabParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#0A1628",
    primary: "#1E6FFF",
    card: "#07111F",
    text: "#FFFFFF",
    border: "#10213A"
  }
};

const MainTabs = () => {
  const { session } = useAuth();
  const setBuildings = useWaypointStore((state) => state.setBuildings);
  const setUser = useWaypointStore((state) => state.setUser);

  useEffect(() => {
    const token = session?.access_token;
    if (!token) {
      return;
    }

    void Promise.all([getMe(token), getBuildings(token)]).then(([user, buildings]) => {
      setUser(user);
      setBuildings(buildings);
    });
  }, [session?.access_token, setBuildings, setUser]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#07111F" },
        headerTintColor: "#FFFFFF",
        tabBarStyle: { backgroundColor: "#07111F", borderTopColor: "#10213A" },
        tabBarActiveTintColor: "#1E6FFF",
        tabBarInactiveTintColor: "#94A3B8"
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Navigator" component={NavigatorScreen} />
      <Tab.Screen name="Mark Exit" component={ExitMarkerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppShell = () => {
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="light" />
      <AuthGate>
        <MainTabs />
      </AuthGate>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
