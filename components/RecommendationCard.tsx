"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { api } from "@/src/lib/api";

export default function RecommendationCard() {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await api.get("/practice/recommendation");
        setRecommendation(res.data);
      } catch (err) {
        console.error("Failed to fetch recommendation", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendation();
  }, []);

  if (loading) return <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />;
  if (!recommendation) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-[#B5B9F0]/30 shadow-lg mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-[#B5B9F0] text-[#0B0909] text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> AI Recommendation
      </div>
      <h3 className="font-bold text-[#0B0909] mb-2 flex items-center gap-2">
        Try: {recommendation.topic.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{recommendation.reason}</p>
      <a 
        href={`/practice?topic=${recommendation.topic.id}&focus=${encodeURIComponent(recommendation.focusArea)}`}
        className="inline-flex items-center gap-2 bg-[#2E4540] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#2E4540]/90 transition"
      >
        Start Session <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
