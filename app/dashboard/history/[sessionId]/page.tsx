"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import Navbar from "@/components/Navbar";

export default function HistoryDetailPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      api.get(`/practice/session/${sessionId}`).then((res) => setSession(res.data)).catch(console.error);
    }
  }, [sessionId]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-3xl mx-auto p-4 md:p-10">
        <button onClick={() => router.back()} className="mb-4 text-gray-500 hover:text-black">&larr; Back to Dashboard</button>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h1 className="text-2xl font-bold">{session.topic}</h1>
          <p className="text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</p>
          <p className="text-xl font-bold text-[#2E4540]">Score: {session.score}%</p>
        </div>
        
        <div className="space-y-4">
          {session.transcript.map((t: any, i: number) => (
            <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${t.role === 'user' ? 'bg-[#E8E9FF] text-[#0B0909]' : 'bg-white border'}`}>
                {t.text}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
