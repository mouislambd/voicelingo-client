"use client";
import { useState } from "react";
import { signIn } from "@/src/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleLogin: Submitting form with email:", email);
    setError("");
    try {
      console.log("handleLogin: Calling signIn.email");
      await signIn.email({ email, password });
      console.log("handleLogin: signIn.email successful, redirecting to /dashboard");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("handleLogin: Error during signIn.email:", err);
      setError(err.message || "Failed to sign in");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn.social({ provider: "google" });
  };

  const handleDemoLogin = () => {
    setEmail("demo@voicelingo.ai");
    setPassword("demo1234");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome back</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:opacity-90"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 space-y-2">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-accent text-primary p-3 rounded-lg font-semibold hover:bg-opacity-80"
          >
            Continue with Google
          </button>
          <button
            onClick={handleDemoLogin}
            className="w-full border border-primary text-primary p-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Try Demo Account
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-accent font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
