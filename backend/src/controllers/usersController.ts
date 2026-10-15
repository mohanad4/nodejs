import { NextFunction, Request, Response } from "express";

import { Prisma } from "../../generated/prisma/client";
import usersService from "../services/usersService";
import { SaveUserRequestBody } from "../types/users";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const saveUser = async (
  req: Request<{}, unknown, SaveUserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, email, password } = req.body ?? {};
    if (!email?.trim()) {
      return res.status(400).json({ message: "email is required" });
    }
    // A password is required for a new user; when updating it is optional
    if (!id && !password) {
      return res.status(400).json({ message: "password is required" });
    }
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    await usersService.saveUser({ ...req.body });
    res.status(id ? 200 : 201).json({
      message: id ? "User updated successfully" : "User created successfully",
    });
  } catch (error) {
    // P2002 = unique constraint failed (email is @unique)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ message: "Email is already in use" });
    }
    next(error);
  }
};

export default { getUsers, saveUser };
