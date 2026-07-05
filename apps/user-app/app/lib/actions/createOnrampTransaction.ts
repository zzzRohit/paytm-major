"use server";
import { getServerSession } from "next-auth";
import db from "@repo/db";
import { authOptions } from "../../../lib/auth";

export async function createOnRampTransaction(
  provider: string,
  amount: number,
): Promise<{ token: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const userId = Number(session.user.id);

  if (Number.isNaN(userId)) {
    throw new Error("Authenticated user id is invalid");
  }

  const token = crypto.randomUUID();
  await db.onRampTransaction.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      amount,
      provider,
      token,
      status: "Processing",
      startTime: new Date(),
    },
  });

  return { token };
}
