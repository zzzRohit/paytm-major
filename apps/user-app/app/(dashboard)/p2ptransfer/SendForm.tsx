"use client";

import { useState } from "react";
import { sendMoney } from "../../lib/actions/p2ptransfer";

export default function SendForm() {
  const [recipientNumber, setRecipientNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recipientNumber || !amount) {
      setMessageType("error");
      setMessage("Please provide recipient number and amount.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await sendMoney(recipientNumber, Number(amount));
      setMessageType("success");
      setMessage("Money sent successfully.");
      setRecipientNumber("");
      setAmount("");
    } catch (err: any) {
      setMessageType("error");
      setMessage(err?.message ?? "Failed to send money.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-slate-950">Send Money</h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter a number and amount, then tap send.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {message && (
          <div
            className={`rounded-md px-4 py-2 text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
            role="status"
          >
            {message}
          </div>
        )}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Recipient Number
          </span>
          <input
            type="tel"
            value={recipientNumber}
            onChange={(event) => setRecipientNumber(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter mobile number"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Amount</span>
          <div className="mt-2 flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
            <span className="text-slate-500">₹</span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="ml-3 w-full bg-transparent text-lg text-slate-950 outline-none"
              placeholder="0.00"
            />
          </div>
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : null}
            <span>{loading ? "Sending..." : "Send Money"}</span>
          </div>
        </button>
      </form>
    </div>
  );
}
