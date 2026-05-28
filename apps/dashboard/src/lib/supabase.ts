import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isDemoMode = import.meta.env.VITE_WAYPOINT_DEMO_MODE !== "false" || !supabaseUrl || !supabaseKey;

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const demoSession: Pick<Session, "access_token"> = {
  access_token: "demo-token"
};
