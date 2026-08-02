import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }
  return `${process.env.BACKEND_URL}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Type definition for session.user
export type User = {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
};
