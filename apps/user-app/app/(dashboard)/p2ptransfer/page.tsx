export default function p2ptransfer() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-slate-950">Send Money</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter a number and amount, then tap send.
          </p>
        </div>

        <form className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Recipient Number
            </span>
            <input
              type="tel"
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
                className="ml-3 w-full bg-transparent text-lg text-slate-950 outline-none"
                placeholder="0.00"
              />
            </div>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Send Money
          </button>
        </form>
      </div>
    </main>
  );
}
