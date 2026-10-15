import { NextFunction, Request, Response } from "express";

import authService from "../services/authService";

// Expects the header "Authorization: Bearer <accessToken>".
// On success the logged-in user is available as req.user in the next handlers.
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = header.slice("Bearer ".length);
  const user = authService.verifyAccessToken(token);
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = user;
  next();
};
