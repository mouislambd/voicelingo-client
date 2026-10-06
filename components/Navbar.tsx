"use client";
import Link from "next/link";
import { useSession, signOut } from "@/src/lib/auth-client";
import { Menu } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        .nav-gradient {
          background: linear-gradient(-45deg, #2E4540, #0B0909, #2E4540, #B5B9F0);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <nav className="sticky top-0 nav-gradient text-white border-b border-white/10 py-2 px-4 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/">
            <div className="brightness-200 contrast-125">
              <Logo />
            </div>
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:text-[#B5B9F0] transition-colors">Home</Link>
            {session ? (
              <>
                <Link href="/practice" className="hover:text-[#B5B9F0] transition-colors">Practice</Link>
                <Link href="/learning" className="hover:text-[#B5B9F0] transition-colors">Learning</Link>
                <Link href="/dashboard" className="hover:text-[#B5B9F0] transition-colors">Dashboard</Link>
                <button onClick={() => signOut()} className="hover:text-[#B5B9F0] transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[#B5B9F0] transition-colors">Login</Link>
                <Link href="/register" className="bg-[#B5B9F0] text-[#0B0909] px-4 py-2 rounded-lg font-semibold hover:bg-[#a1a5e0] transition-colors">Register</Link>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}><Menu /></button>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4 p-4 bg-[#0B0909]/90 backdrop-blur-sm border-t border-white/10 space-y-2">
            <Link href="/" className="block hover:text-[#B5B9F0]">Home</Link>
            {session ? (
              <>
                <Link href="/practice" className="block hover:text-[#B5B9F0]">Practice</Link>
                <Link href="/learning" className="block hover:text-[#B5B9F0]">Learning</Link>
                <Link href="/dashboard" className="block hover:text-[#B5B9F0]">Dashboard</Link>
                <button onClick={() => signOut()} className="block hover:text-[#B5B9F0]">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block hover:text-[#B5B9F0]">Login</Link>
                <Link href="/register" className="block text-[#B5B9F0] font-semibold">Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
