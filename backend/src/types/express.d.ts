import { TokenPayload } from "./auth";

// Adds req.user, which requireAuth sets after checking the token
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
