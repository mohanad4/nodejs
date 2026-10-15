import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../../db/prismaConfig";
import { AuthUser, TokenPayload } from "../types/auth";

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwtSecret;
};

const createAccessToken = ({ id, email }: TokenPayload) => {
  const payload: TokenPayload = { id, email };
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
      "1h") as jwt.SignOptions["expiresIn"],
  });
};

const login = async (email: string, password: string) => {
  // User -> UserRole -> Role -> RolePermission -> Permission, keeping only the names
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
              permissions: {
                select: { permission: { select: { name: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!existingUser) {
    return null;
  }
  const valid = await bcrypt.compare(password, existingUser.password);
  if (!valid) {
    return null;
  }

  const roles = existingUser.roles.map(({ role }) => role.name);
  // Two roles can grant the same permission, so remove duplicates
  const permissions = [
    ...new Set(
      existingUser.roles.flatMap(({ role }) =>
        role.permissions.map(({ permission }) => permission.name),
      ),
    ),
  ];

  const user: AuthUser = {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    roles,
    permissions,
  };

  return { user, accessToken: createAccessToken(user) };
};

const verifyAccessToken = (token: string): TokenPayload | null => {
  const jwtSecret = getJwtSecret();
  try {
    const payload = jwt.verify(token, jwtSecret) as TokenPayload;

    return { id: payload.id, email: payload.email };
  } catch {
    console.log("im here")
    return null;
  }
};

export default { login, verifyAccessToken };
