import { NextFunction, Request, Response } from "express";

// Catches errors passed to next() or thrown in routes, so clients get JSON instead of Express's HTML error page.
// Register it in app.ts last, after notFound.
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: "Internal server error" });
};
