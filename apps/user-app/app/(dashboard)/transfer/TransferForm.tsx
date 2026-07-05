"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createOnRampTransaction } from "../../lib/actions/createOnrampTransaction";

interface TransferFormProps {
  banks: string[];
  initialBank: string;
  initialAmount: number;
}

export default function TransferForm({
  banks,
  initialBank,
  initialAmount,
}: TransferFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(initialAmount);
  const [bank, setBank] = useState(initialBank);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const transaction = await createOnRampTransaction(bank, amount);
      if (transaction?.token) {
        router.push(
          `/hdfc-payment?token=${encodeURIComponent(
            transaction.token,
          )}&bank=${encodeURIComponent(bank)}&amount=${amount}`,
        );
        return;
      }

      setStatus(`Transaction created for ₹${amount} via ${bank}.`);
    } catch (err) {
      console.error(err);
      setError("Unable to create transaction. Please try again.");
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-950">Add Money</h2>
        <p className="text-sm text-slate-500">
          Fill in the details below to transfer funds.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Amount</span>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter amount"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Bank</span>
          <select
            value={bank}
            onChange={(event) => setBank(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            {banks.map((bankOption) => (
              <option key={bankOption} value={bankOption}>
                {bankOption}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Add Money
        </button>

        {status ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {status}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </form>
    </div>
  );
}
