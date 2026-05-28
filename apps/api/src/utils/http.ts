import type { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (handler: (request: Request, response: Response, next: NextFunction) => Promise<void>) =>
  (request: Request, response: Response, next: NextFunction) => {
    handler(request, response, next).catch(next);
  };

export const handleError = (error: unknown, response: Response) => {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message === "Forbidden") {
    response.status(403).json({ error: "Forbidden" });
    return;
  }
  if (message === "Not found") {
    response.status(404).json({ error: "Not found" });
    return;
  }

  response.status(500).json({ error: "Internal server error" });
};
