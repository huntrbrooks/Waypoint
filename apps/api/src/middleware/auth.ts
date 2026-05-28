import type { NextFunction, Request, Response } from "express";
import type { User } from "@waypoint/types";
import { env, hasSupabaseConfig } from "../config/env.js";
import { mockRepository, supabaseRepository } from "../db/repository.js";
import { supabaseAdmin } from "../db/supabase.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const extractBearerToken = (authorization?: string) => {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length);
};

export const requireUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(request.header("authorization"));

    if (!hasSupabaseConfig || !supabaseAdmin) {
      if (!env.demoMode) {
        response.status(503).json({ error: "Supabase is not configured" });
        return;
      }

      const demoUser = await mockRepository.getUser("demo-user");
      if (!demoUser) {
        response.status(500).json({ error: "Demo user is unavailable" });
        return;
      }

      request.user = demoUser;
      next();
      return;
    }

    if (!token) {
      response.status(401).json({ error: "Missing Bearer token" });
      return;
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      response.status(401).json({ error: "Invalid session" });
      return;
    }

    const user = await supabaseRepository.getUser(data.user.id);
    if (!user) {
      response.status(403).json({ error: "User profile is not provisioned" });
      return;
    }

    request.user = user;
    next();
  } catch {
    response.status(500).json({ error: "Unable to authenticate request" });
  }
};

export const currentRepository = () => (hasSupabaseConfig ? supabaseRepository : mockRepository);
