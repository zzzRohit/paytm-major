"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm({
  googleEnabled,
}: {
  googleEnabled: boolean;
}): JSX.Element {
  const router = useRouter();
  const [phone, setPhone] = useState("9876543210");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      phone,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid phone number or password.");
      return;
    }

    router.push(result?.url ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-950">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the seeded test account or continue with Google.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleCredentialsLogin}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Phone number
          </span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            inputMode="numeric"
            name="phone"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="9876543210"
            value={phone}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={loading}
          type="submit"
        >
          {loading ? "Logging in..." : "Login with number"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
        disabled={!googleEnabled}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        type="button"
      >
        Login with Google
      </button>

      {!googleEnabled ? (
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google login.
        </p>
      ) : null}
    </div>
  );
}
