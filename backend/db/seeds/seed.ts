import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { prisma } from "../prismaConfig";

dotenv.config();

async function main() {
  const superadminEmail = "superadmin@example.com";
  const superadminPassword = process.env.SEED_SUPERADMIN_PASSWORD;
  const permissionNames = ["bank_view", "bank_add", "bank_edit", "bank_Export"];
  const rolePermissions: Record<string, string[]> = {
    admin: permissionNames,
    bank: ["bank_view"],
    user: [],
  };
  const Roles = Object.keys(rolePermissions);

  if (!superadminPassword) {
    throw new Error("SEED_SUPERADMIN_PASSWORD is not set in .env");
  }

  const SALT_ROUNDS = 10;
  const superadminHash = await bcrypt.hash(superadminPassword, SALT_ROUNDS);

  for (const code of permissionNames) {
    await prisma.permission.upsert({
      where: { name: code },
      update: {},
      create: { name: code },
    });
  }

  for (const role of Roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        permissions: {
          create: rolePermissions[role].map((name) => ({
            permission: { connect: { name } },
          })),
        },
      },
    });
  }

  const roles = await prisma.role.findMany({
    where: { name: { in: Roles } },
    select: { id: true, name: true },
  });

  const superadmin = await prisma.user.upsert({
    where: { email: superadminEmail },
    update: {},
    create: {
      email: superadminEmail,
      name: "Super Admin",
      password: superadminHash,
      phone: "1234567890",
    },
    omit: { password: true },
  });

  const adminRoleId = roles.find((r) => r.name === "admin")!.id;

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superadmin.id, roleId: adminRoleId } },
    update: {},
    create: {
      userId: superadmin.id,
      roleId: adminRoleId,
    },
  });

  console.log("Superadmin user seeded:", superadmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
