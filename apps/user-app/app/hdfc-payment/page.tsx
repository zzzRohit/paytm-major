"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function HdfcPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";
  const bank = searchParams.get("bank") ?? "HDFC Bank";
  const amount = searchParams.get("amount") ?? "0";

  function handlePaymentComplete() {
    router.push(
      `/transfer?paymentSuccess=true&token=${encodeURIComponent(token)}`,
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-700">HDFC Net Banking</p>
          <h1 className="mt-2 text-3xl font-semibold">Complete your payment</h1>
          <p className="mt-3 text-sm text-slate-500">
            You are paying <span className="font-semibold">₹{amount}</span>{" "}
            using <span className="font-semibold">{bank}</span>.
          </p>
        </div>

        <div className="space-y-5 rounded-2xl bg-slate-50 p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Transaction reference</p>
            <p className="mt-1 font-semibold text-slate-950 break-all">
              {token}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-1 font-semibold text-emerald-700">Ready to pay</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePaymentComplete}
          className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Complete payment
        </button>
      </section>
    </main>
  );
}
