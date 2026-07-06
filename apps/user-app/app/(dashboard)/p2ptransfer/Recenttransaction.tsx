import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import db from "@repo/db";

export default async function recenttransaction() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  const recentTransactions = await db.p2pTransfer.findMany({
    where: { fromUserId: userId },
    include:{toUser:true},  
    orderBy: { timestamp: "desc" },
    take: 5,
  });
  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Recent Transactions
          </h2>
          <p className="text-sm text-slate-500">Latest on-ramp activity.</p>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            No transactions yet.
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className=" text-slate-950">
                      {tx.toUser?.name ?? "Unknown Recipient"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    ₹{tx.amount}
                  </p>
                </div>
                <p className="mt-2 text-xs uppercase text-slate-500">
                  {tx.fromUserId === userId ? "Sent" : "Received"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
