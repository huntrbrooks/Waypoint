import cors, { type CorsOptions } from "cors";
import express from "express";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { z } from "zod";
import type { EvacuationStateMessage } from "@waypoint/types";
import { env, shouldUseSupabase } from "./config/env.js";
import { authenticateAccessToken, currentRepository, requireUser } from "./middleware/auth.js";
import { asyncHandler, handleError } from "./utils/http.js";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const corsOptions: CorsOptions =
  env.corsOrigins === "*"
    ? { origin: "*" }
    : {
        origin: (origin, callback) => {
          if (!origin || env.corsOrigins.includes(origin)) {
            callback(null, true);
            return;
          }
          callback(new Error("CORS origin blocked"));
        }
      };

app.use(cors(corsOptions));
app.use(express.json());

const exitInputSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  floor: z.number().int().positive(),
  label: z.string().trim().min(1).max(120)
});

const broadcast = (message: EvacuationStateMessage) => {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
};

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "waypoint-api", dataMode: shouldUseSupabase ? "supabase" : "demo" });
});

app.use(requireUser);

app.get(
  "/me",
  asyncHandler(async (request, response) => {
    response.json(request.user);
  })
);

app.get(
  "/buildings",
  asyncHandler(async (request, response) => {
    response.json(await currentRepository().listBuildings(request.user!));
  })
);

app.get(
  "/buildings/:id/exits",
  asyncHandler(async (request, response) => {
    response.json(await currentRepository().listExits(request.params.id, request.user!));
  })
);

app.post(
  "/buildings/:id/exits",
  asyncHandler(async (request, response) => {
    const parsed = exitInputSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Request body must include valid lat, lng, floor, and label" });
      return;
    }

    const exit = await currentRepository().createExit(request.params.id, parsed.data, request.user!);
    response.status(201).json(exit);
  })
);

app.post(
  "/buildings/:id/evacuate",
  asyncHandler(async (request, response) => {
    const event = await currentRepository().triggerEvacuation(request.params.id, request.user!);
    broadcast({ type: "evacuation_triggered", event });
    response.status(201).json(event);
  })
);

app.get(
  "/events",
  asyncHandler(async (request, response) => {
    response.json(await currentRepository().listEvents(request.user!));
  })
);

app.get(
  "/events/:id",
  asyncHandler(async (request, response) => {
    const event = await currentRepository().getEvent(request.params.id, request.user!);
    if (!event) {
      response.status(404).json({ error: "Event not found" });
      return;
    }

    response.json(event);
  })
);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  handleError(error, response);
});

wss.on("connection", (socket, request) => {
  const token = new URL(request.url ?? "/ws", `http://${request.headers.host ?? "localhost"}`).searchParams.get("token");

  void authenticateAccessToken(token)
    .then((user) => {
      if (!user) {
        socket.close(1008, "Unauthorized");
        return;
      }

      socket.send(JSON.stringify({ type: "connected", service: "waypoint-api" }));
    })
    .catch(() => {
      socket.close(1011, "Authentication failed");
    });
});

server.listen(env.port, () => {
  console.log(`Waypoint API listening on http://localhost:${env.port}`);
  console.log(`Waypoint WebSocket listening on ws://localhost:${env.port}/ws`);
});
