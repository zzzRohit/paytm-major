import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardActions } from "./DashboardActions";

export default async function DashboardPage(): Promise<JSX.Element> {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Dashboard</p>
            <h1 className="mt-1 text-3xl font-semibold">
              Welcome, {session.user.name ?? "User"}
            </h1>
          </div>
          <DashboardActions />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Wallet balance</p>
            <p className="mt-2 text-2xl font-semibold">Rs 12,450</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Recent transfers</p>
            <p className="mt-2 text-2xl font-semibold">8</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Account status</p>
            <p className="mt-2 text-2xl font-semibold">Active</p>
          </div>
        </div>
      </section>
    </main>
  );
}
