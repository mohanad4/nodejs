import bcrypt from "bcryptjs";

import { prisma } from "../../db/prismaConfig";
import { SaveUserRequestBody } from "../types/users";

const SALT_ROUNDS = 10;

const getAllUsers = () => {
  return prisma.user.findMany({
    omit: { password: true }, // never send password hashes to the client
    orderBy: { id: "asc" },
  });
};

const saveUser = async ({
  id,
  email,
  name,
  phone,
  password,
}: SaveUserRequestBody) => {
  const fields = { email, name: name || null, phone: phone || null };
  const passwordHash = password
    ? await bcrypt.hash(password, SALT_ROUNDS)
    : undefined;

  return prisma.user.upsert({
    where: { id: id ?? 0 },
    update: { ...fields, password: passwordHash },
    create: { ...fields, password: passwordHash ?? "" },
    omit: { password: true },
  });
};

export default { getAllUsers, saveUser };
