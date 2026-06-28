"use client";

import { Appbar } from "@repo/ui";
import { signIn, signOut, useSession } from "next-auth/react";

export function AppbarClient(): JSX.Element {
  const { data: session } = useSession();

  return (
    <Appbar
      user={session?.user}
      onSignin={() => signIn(undefined, { callbackUrl: "/dashboard" })}
      onSignout={() => signOut({ callbackUrl: "/login" })}
    />
  );
}
