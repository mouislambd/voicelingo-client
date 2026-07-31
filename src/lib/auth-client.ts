import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Type definition for session.user
export type User = {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
};
