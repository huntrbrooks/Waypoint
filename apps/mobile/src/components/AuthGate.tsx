import { useState, type PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "@/lib/auth";
import { isDemoMode } from "@/lib/supabase";

export const AuthGate = ({ children }: PropsWithChildren) => {
  const { initialized, session, signIn } = useAuth();
  const [email, setEmail] = useState("admin@waypoint.app");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  if (!initialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Waypoint...</Text>
      </View>
    );
  }

  if (session) {
    return <>{children}</>;
  }

  const submit = async () => {
    setError("");
    try {
      await signIn(email, password);
    } catch {
      setError(isDemoMode ? "Use admin@waypoint.app / demo1234 in demo mode." : "Unable to sign in with those credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>WAYPOINT</Text>
      <Text style={styles.subtitle}>Mobile evacuation access</Text>
      {isDemoMode && <Text style={styles.demo}>Demo mode is active until Supabase env vars are configured.</Text>}
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>SIGN IN</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1628",
    justifyContent: "center",
    padding: 24
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 4
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900"
  },
  subtitle: {
    color: "#8FB7FF",
    marginTop: 8,
    marginBottom: 24
  },
  demo: {
    color: "#BFDBFE",
    backgroundColor: "#1E6FFF22",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16
  },
  input: {
    backgroundColor: "#10213A",
    color: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E6FFF",
    marginBottom: 12
  },
  error: {
    color: "#FCA5A5",
    marginBottom: 12
  },
  button: {
    backgroundColor: "#1E6FFF",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center"
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900"
  }
});
