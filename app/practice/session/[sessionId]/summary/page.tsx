"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SessionSummaryPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup any lingering audio state
    window.speechSynthesis.cancel();
    
    console.log("Summary page mounted. Session ID:", sessionId);

    if (!sessionId) {
      console.error("No sessionId found in URL params");
      setError("Invalid session.");
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        console.log("Calling endSession API with sessionId:", sessionId);
        const res = await api.post("/api/practice/end", { sessionId });
        console.log("End session API response:", JSON.stringify(res.data, null, 2));
        setSummary(res.data);
      } catch (err: any) {
        console.error("Failed to fetch session summary. Error object:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          fullError: err
        });
        setError(`Failed to load session summary: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [sessionId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading your results...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500">{error}</p>
      <Link href="/dashboard" className="bg-[#2E4540] text-white px-6 py-3 rounded-full font-semibold">Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 md:p-10 max-w-2xl mx-auto w-full text-center">
        <h1 className="text-4xl font-bold text-[#0B0909] mb-8">Session Summary</h1>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <p className="text-sm text-gray-500 mb-2">Final Score</p>
          <div className="text-6xl font-bold text-[#B5B9F0]">{summary.score}/100</div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-left">
          <h2 className="text-xl font-bold text-[#0B0909] mb-4">Summary</h2>
          <p className="text-gray-600">{summary.summary}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-left">
          <h2 className="text-xl font-bold text-[#0B0909] mb-4">Areas to Improve</h2>
          <div className="flex flex-wrap gap-2">
            {(summary.weakAreaTags || []).map((tag: string) => (
              <span key={tag} className="px-4 py-2 bg-[#B5B9F0]/20 text-[#0B0909] rounded-full text-sm font-semibold">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/practice" className="bg-[#2E4540] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition">
            Practice Again
          </Link>
          <Link href="/dashboard" className="border border-[#2E4540] text-[#2E4540] px-8 py-3 rounded-full font-semibold hover:bg-[#2E4540]/5 transition">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
