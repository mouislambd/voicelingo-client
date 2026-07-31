import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2E4540] text-white p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-200">© 2026 VoiceLingo. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/about" className="text-white hover:text-[#B5B9F0] transition">About</a>
          <a href="/contact" className="text-white hover:text-[#B5B9F0] transition">Contact</a>
        </div>
        <div className="flex gap-4">
          <Github size={20} className="text-white hover:text-[#B5B9F0] cursor-pointer transition" />
          <Twitter size={20} className="text-white hover:text-[#B5B9F0] cursor-pointer transition" />
          <Linkedin size={20} className="text-white hover:text-[#B5B9F0] cursor-pointer transition" />
        </div>
      </div>
    </footer>
  );
}
