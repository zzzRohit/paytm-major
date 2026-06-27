import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <LoginForm googleEnabled={googleEnabled} />
    </main>
  );
}
