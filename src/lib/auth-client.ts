import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Type definition for session.user
export type User = {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
};
