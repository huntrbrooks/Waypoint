import type { NextFunction, Request, Response } from "express";
import type { User } from "@waypoint/types";
import { env, shouldUseSupabase } from "../config/env.js";
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

export const authenticateAccessToken = async (token: string | null): Promise<User | null> => {
  if (!shouldUseSupabase || !supabaseAdmin) {
    return env.demoMode ? mockRepository.getUser("demo-user") : null;
  }

  if (!token) {
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return supabaseRepository.getUser(data.user.id);
};

export const requireUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(request.header("authorization"));

    if (!shouldUseSupabase || !supabaseAdmin) {
      if (!env.demoMode) {
        response.status(503).json({ error: "Supabase is not configured" });
        return;
      }

      const demoUser = await authenticateAccessToken(token);
      if (!demoUser) {
        response.status(500).json({ error: "Demo user is unavailable" });
        return;
      }

      request.user = demoUser;
      next();
      return;
    }

    const user = await authenticateAccessToken(token);
    if (!token) {
      response.status(401).json({ error: "Missing Bearer token" });
      return;
    }
    if (!user) {
      response.status(401).json({ error: "Invalid session" });
      return;
    }

    request.user = user;
    next();
  } catch {
    response.status(500).json({ error: "Unable to authenticate request" });
  }
};

export const currentRepository = () => (shouldUseSupabase ? supabaseRepository : mockRepository);
