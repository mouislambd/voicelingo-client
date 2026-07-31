"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { api } from "@/src/lib/api";
import Navbar from "@/components/Navbar";

export default function PracticePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
    api.get("/api/topics")
        .then((res) => {
          console.log("Full Topics API Response Data:", JSON.stringify(res.data, null, 2));
          // Assuming it might be res.data.topics, or res.data.data, or just res.data
          // Let's log it and find out
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

  const startPractice = async (topicId: string) => {
    try {
      const res = await api.post("/api/practice/start", { topicId });
      router.push(`/practice/session/${res.data.sessionId}`);
    } catch (error) {
      console.error("Failed to start session", error);
    }
  };

  if (isPending || !session) return null;

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
