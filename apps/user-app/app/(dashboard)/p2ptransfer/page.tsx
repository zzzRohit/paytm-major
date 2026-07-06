import SendForm from "./SendForm";
import Recenttransactions from "./Recenttransaction";
export default function p2ptransfer() {
  return (
    <main className="min-h-screen bg-slate-100 py-10 px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Send Money</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-[2]">
            <SendForm />
          </div>

          <div className="flex-1">
            <Recenttransactions />
          </div>
        </div>
      </div>
    </main>
  );
}
