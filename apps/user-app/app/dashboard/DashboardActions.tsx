"use client";

import { signOut } from "next-auth/react";

export function DashboardActions(): JSX.Element {
  return (
    <button
      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white"
      onClick={() => signOut({ callbackUrl: "/login" })}
      type="button"
    >
      Sign out
    </button>
  );
}
