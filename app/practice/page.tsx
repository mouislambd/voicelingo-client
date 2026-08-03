"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { api } from "@/src/lib/api";
import Navbar from "@/components/Navbar";

function PracticeContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [isAutoStarting, setIsAutoStarting] = useState(false);
  const [autoStartError, setAutoStartError] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      api.get("/topics")
        .then((res) => {
          const topics = Array.isArray(res.data?.topics) ? res.data.topics : 
                         Array.isArray(res.data?.data) ? res.data.data : 
                         Array.isArray(res.data) ? res.data : [];
          setTopics(topics);
        })
        .catch((err) => {
          console.error("Topics API Error:", err);
        });
    }
  }, [session]);

  const startPractice = async (topicId: string, focusArea?: string) => {
    try {
      const res = await api.post("/practice/start", { topicId, focusArea });
      router.push(`/practice/session/${res.data.sessionId}`);
    } catch (error) {
      console.error("Failed to start session", error);
      throw error;
    }
  };

  useEffect(() => {
    const topicId = searchParams.get("topic");
    const focus = searchParams.get("focus");

    if (topicId && focus && !isAutoStarting && !autoStartError) {
      setIsAutoStarting(true);
      startPractice(topicId, focus)
        .catch(() => {
          setIsAutoStarting(false);
          setAutoStartError(true);
        });
    }
  }, [searchParams, isAutoStarting, autoStartError, router]);

  if (isPending || !session) return null;

  if (isAutoStarting) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center">
        <p className="text-gray-600">Starting your recommended session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="p-6 md:p-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0B0909] mb-8">Choose a Practice Topic</h1>
        {topics.length === 0 ? (
          <p className="text-gray-600">No topics available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <button
                key={topic._id}
                onClick={() => startPractice(topic._id)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[#0B0909] text-xl group-hover:text-[#2E4540]">{topic.title}</h3>
                  <span className="px-2 py-1 bg-[#B5B9F0]/20 text-[#2E4540] rounded-full text-xs font-semibold">{topic.level}</span>
                </div>
                <p className="text-gray-600 text-sm">{topic.description}</p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={null}>
      <PracticeContent />
    </Suspense>
  );
}
