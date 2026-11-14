import { hashPassword } from "better-auth/crypto";
import { prisma } from "../prisma";

export async function upsertPendingRegisteration(
  email: string,
  fullName: string,
  password: string,
) {
  const passwordHash = await hashPassword(password);

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  await prisma.pendingRegisteration.upsert({
    where: { email },
    update: {
      name: fullName,
      passwordHash,
      expiresAt: expiresAt,
    },
    create: {
      email: email,
      name: fullName,
      passwordHash,
      expiresAt: expiresAt,
    },
  });
}


//သီးသန့်
export async function applyPendingRegisteration(email: string) {
  const pendingRegisteration = await prisma.pendingRegisteration.findUnique({
    where: { email },
  });

  if (!pendingRegisteration) {
    return { success: true, status: "NEW_USER" };
  }

  if (pendingRegisteration.expiresAt < new Date()) {
    await prisma.pendingRegisteration.delete({ where: { email } });
    return { success: false, error: "EXPIRED" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    await prisma.pendingRegisteration.delete({ where: { email } });
    return { success: false, error: "USER_NOT_FOUND" };
  }

  try {
    await prisma.$transaction(async (trx) => {
      await trx.user.update({
        where: { id: user.id },
        data: { name: pendingRegisteration.name },
      });

      await trx.account.updateMany({
        where: { userId: user.id },
        data: { password: pendingRegisteration.passwordHash },
      });

      await trx.pendingRegisteration.delete({
        where: { email },
      });
    });

    return { success: true, status: "RESUMED_USER" };
  } catch (error) {
    console.error("Failed to apply pending registration:", error);
    return { success: false, error: "TRANSACTION_FAILED" };
  }
}
