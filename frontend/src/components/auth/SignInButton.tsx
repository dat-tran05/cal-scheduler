"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Calendar } from "lucide-react";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button disabled>
        <Calendar className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <p className="font-medium">{session.user?.name}</p>
          <p className="text-muted-foreground">{session.user?.email}</p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => signIn("google")}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
}
