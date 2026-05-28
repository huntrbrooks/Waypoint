import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { Session } from "@supabase/supabase-js";
import { demoSession, isDemoMode, supabase } from "./supabase";

interface AuthContextValue {
  initialized: boolean;
  session: Pick<Session, "access_token"> | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(isDemoMode);
  const [session, setSession] = useState<Pick<Session, "access_token"> | null>(isDemoMode ? demoSession : null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitialized(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setInitialized(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      session,
      signIn: async (email, password) => {
        if (!supabase) {
          if (email === "admin@waypoint.app" && password === "demo1234") {
            setSession(demoSession);
            return;
          }
          throw new Error("Invalid demo credentials");
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        if (supabase) {
          await supabase.auth.signOut();
        }
        setSession(isDemoMode ? null : null);
      }
    }),
    [initialized, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
