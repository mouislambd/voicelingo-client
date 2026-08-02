"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { api } from "@/src/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
            const [progressRes, historyRes] = await Promise.all([
              api.get("/practice/progress"),
              api.get("/practice/history"),
            ]);
          console.log("Fetched history data:", historyRes.data);
          setStats({
            ...progressRes.data,
            weakAreas: Array.isArray(progressRes.data.weakAreas) ? progressRes.data.weakAreas : [],
          });
          setHistory(Array.isArray(historyRes.data) ? historyRes.data : Array.isArray(historyRes.data?.sessions) ? historyRes.data.sessions : []);
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        }
      };
      fetchData();
    }
  }, [session]);

  if (isPending || !session) return null;

  const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this session? This cannot be undone.")) return;

    console.log("Attempting to delete session:", sessionId);
    try {
      const response = await api.delete(`/practice/session/${sessionId}`);
      console.log("Delete session API response:", response.data);
      setHistory((prev) => prev.filter((s) => s._id !== sessionId));
      setStats((prev: any) => ({ ...prev, totalSessions: Math.max(0, prev.totalSessions - 1) }));
      alert("Session deleted successfully.");
    } catch (error) {
      console.error("Failed to delete session", error);
      alert("Failed to delete session.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-grow p-4 md:p-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B0909]">Welcome back, {session.user.name}!</h1>
            <p className="text-gray-600">Ready to continue your language journey?</p>
          </div>
          <Link href="/practice" className="bg-[#2E4540] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition text-center">
            Start New Practice
          </Link>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Sessions" value={stats.totalSessions} />
            <StatCard label="Avg Score" value={`${stats.averageScore}%`} />
            <StatCard label="Level" value={stats.currentLevel} />
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Weak Areas</p>
              <div className="flex flex-wrap gap-1">
                {stats.weakAreas
                  .filter((area: string) => area.length <= 30)
                  .map((area: string, index: number) => (
                    <span key={`${area}-${index}`} className="px-2 py-0.5 bg-[#B5B9F0] text-[#0B0909] rounded-full text-[10px] font-semibold">{area}</span>
                  ))}
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-[#0B0909] mb-4">Recent Sessions</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-h-96 overflow-y-auto">
          {history.length > 0 ? (
            history.map((session) => (
              <div 
                key={session._id} 
                className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/dashboard/history/${session._id}`)}
              >
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[#0B0909] text-sm">{session.topic}</h3>
                  <p className="text-[10px] text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-[#E8E9FF] text-[#2E4540] rounded-md text-xs font-bold">{session.score}%</span>
                  <button 
                    onClick={(e) => deleteSession(e, session._id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 flex items-center justify-center w-8 h-8 rounded-full"
                    title="Delete Session"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-sm text-gray-500">No recent sessions found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-[#2E4540]">{value}</p>
    </div>
  );
}
