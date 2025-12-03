"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded bg-white text-gray border border-gray-light font-semibold hover:bg-gray-lighter transition-colors"
      onClick={() => void signOut()}
    >
      Sair
    </button>
  );
}
