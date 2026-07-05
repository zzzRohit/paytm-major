import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import db from "@repo/db";
import { authOptions } from "../../../lib/auth";
import TransferForm from "./TransferForm";

const banks = ["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank"];

export default async function TransfersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    redirect("/login");
  }

  const balanceRecord = await db.balance.findUnique({
    where: { userId },
  });

  const recentTransactions = await db.onRampTransaction.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    take: 5,
  });

  const totalBalance = balanceRecord?.amount ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Transfer</p>
            <h1 className="mt-1 text-3xl font-semibold">
              Add money to your wallet
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Top up your wallet instantly using a supported bank.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <TransferForm
              banks={banks}
              initialBank={banks[0]!}
              initialAmount={1000}
            />
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950">
                  Balance
                </h2>
                <span className="text-sm text-slate-500">Updated just now</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-600">Total Balance</span>
                  <span className="font-semibold text-slate-950">
                    ₹{totalBalance}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-950">
                  Recent Transactions
                </h2>
                <p className="text-sm text-slate-500">
                  Latest on-ramp activity.
                </p>
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
                          <p className="font-semibold text-slate-950">
                            {tx.provider}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(tx.startTime).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          ₹{tx.amount}
                        </p>
                      </div>
                      <p className="mt-2 text-xs uppercase text-slate-500">
                        {tx.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
