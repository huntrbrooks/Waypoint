import "dotenv/config";

const rawOrigins = process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? "*";

export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigins: rawOrigins === "*" ? "*" : rawOrigins.split(",").map((origin) => origin.trim()),
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  demoMode: process.env.WAYPOINT_DEMO_MODE !== "false"
};

export const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
