"use client";

import React from "react";

export default function Logo() {
  return (
    <div className="group cursor-pointer transition-transform duration-300 hover:scale-105 inline-block">
      <style jsx>{`
        @keyframes pulse-bar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @keyframes breathe-glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(181, 185, 240, 0.4)); }
          50% { filter: drop-shadow(0 0 8px rgba(181, 185, 240, 0.8)); }
        }
        .animate-pulse-bar {
          transform-origin: bottom;
          animation: pulse-bar 1.5s infinite ease-in-out;
        }
        .animate-breathe {
          animation: breathe-glow 3s infinite ease-in-out;
        }
      `}</style>
      <svg width="180" height="46" viewBox="0 0 220 56" xmlns="http://www.w3.org/2000/svg" className="w-[140px] md:w-[180px] h-auto">
        <defs>
          <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E4540" />
            <stop offset="100%" stopColor="#3d5a54" />
          </linearGradient>
        </defs>
        <g className="animate-breathe">
          <path d="M4 22c0-9.94 8.06-18 18-18h4c9.94 0 18 8.06 18 18s-8.06 18-18 18h-3.2l-6.8 7v-7.6C8.6 37.7 4 30.4 4 22z"
                fill="url(#bubbleGrad)"/>
          <rect className="animate-pulse-bar" x="13" y="18" width="3" height="8" rx="1.5" fill="#B5B9F0" style={{ animationDelay: '0ms' }} />
          <rect className="animate-pulse-bar" x="19" y="12" width="3" height="20" rx="1.5" fill="#B5B9F0" style={{ animationDelay: '150ms' }} />
          <rect className="animate-pulse-bar" x="25" y="8"  width="3" height="28" rx="1.5" fill="#B5B9F0" style={{ animationDelay: '300ms' }} />
          <rect className="animate-pulse-bar" x="31" y="14" width="3" height="16" rx="1.5" fill="#B5B9F0" style={{ animationDelay: '450ms' }} />
        </g>
        <text x="52" y="35" fontFamily="Arial, Helvetica, sans-serif" fontSize="24" fontWeight="700" fill="#0B0909" className="tracking-tight">
          Voice<tspan fill="#2E4540">Lingo</tspan>
        </text>
      </svg>
    </div>
  );
}
