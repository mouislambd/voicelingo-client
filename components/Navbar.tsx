"use client";
import Link from "next/link";
import { useSession, signOut } from "@/src/lib/auth-client";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-100 p-4 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-primary">VoiceLingo</Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="hover:text-accent">Home</Link>
          {session ? (
            <>
              <Link href="/practice" className="hover:text-accent">Practice</Link>
              <Link href="/dashboard" className="hover:text-accent">Dashboard</Link>
              <button onClick={() => signOut()} className="text-primary hover:text-accent">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-accent">Login</Link>
              <Link href="/register" className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90">Register</Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}><Menu /></button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 p-4 bg-white border-t border-gray-100 space-y-2">
          <Link href="/" className="block hover:text-accent">Home</Link>
          {session ? (
            <>
              <Link href="/practice" className="block hover:text-accent">Practice</Link>
              <Link href="/dashboard" className="block hover:text-accent">Dashboard</Link>
              <button onClick={() => signOut()} className="block text-primary hover:text-accent">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block hover:text-accent">Login</Link>
              <Link href="/register" className="block text-accent font-semibold">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
