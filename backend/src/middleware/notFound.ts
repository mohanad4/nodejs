import { Request, Response } from "express";

// Runs when no route matched. Register it in app.ts after all routes, before errorHandler.
export const notFound = (req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};
