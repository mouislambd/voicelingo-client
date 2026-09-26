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
        <Link href="/" className="flex items-center">
          <svg width="180" height="46" viewBox="0 0 220 56" xmlns="http://www.w3.org/2000/svg" className="w-[140px] md:w-[180px] h-auto">
            <g>
              <path d="M4 22c0-9.94 8.06-18 18-18h4c9.94 0 18 8.06 18 18s-8.06 18-18 18h-3.2l-6.8 7v-7.6C8.6 37.7 4 30.4 4 22z"
                    fill="#2E4540"/>
              <rect x="13" y="18" width="3" height="8" rx="1.5" fill="#B5B9F0"/>
              <rect x="19" y="12" width="3" height="20" rx="1.5" fill="#B5B9F0"/>
              <rect x="25" y="8"  width="3" height="28" rx="1.5" fill="#B5B9F0"/>
              <rect x="31" y="14" width="3" height="16" rx="1.5" fill="#B5B9F0"/>
            </g>
            <text x="52" y="35" fontFamily="Arial, Helvetica, sans-serif" fontSize="24" fontWeight="700" fill="#0B0909">Voice<tspan fill="#2E4540">Lingo</tspan></text>
          </svg>
        </Link>
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
