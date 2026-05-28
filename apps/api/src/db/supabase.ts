import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseConfig } from "../config/env.js";

export const supabaseAdmin = hasSupabaseConfig
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
