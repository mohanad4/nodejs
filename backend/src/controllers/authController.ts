import { NextFunction, Request, Response } from "express";

import authService from "../services/authService";
import { AuthResponse, LoginRequestBody } from "../types/auth";

const loginController = async (
  req: Request<{}, AuthResponse, LoginRequestBody>,
  res: Response<AuthResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const result = await authService.login(email, password);
    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", ...result });
  } catch (error) {
    next(error);
  }
};

export default { loginController };
