"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import db, { prisma } from "@repo/db/client";
export async function sendMoney(recipientNumber: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = Number(session?.user?.id);

  if (!from) {
    throw new Error("User not authenticated");
  }
  const touser = await db.user.findUnique({
    where: {
      phone: recipientNumber,
    },
  });

  if (!touser) {
    throw new Error("Recipient not found");
  }
  if (from === touser.id) {
    throw new Error("Cannot send money to yourself");
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(from) },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }
    await new Promise((r) => setTimeout(r, 4000));
    await tx.balance.update({
      where: { userId: Number(from) },
      data: { amount: { decrement: amount } },
    });

    await tx.balance.update({
      where: { userId: touser.id },
      data: { amount: { increment: amount } },
    });
    // Record the p2p transfer
    await tx.p2pTransfer.create({
      data: {
        amount: amount,
        timestamp: new Date(),
        fromUserId: Number(from),
        toUserId: touser.id,
      },
    });
  });
}
