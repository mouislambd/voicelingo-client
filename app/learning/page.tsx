"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/src/lib/api";

export default function LearningPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    api.get("/topics")
      .then((res) => {
        const topicsData = Array.isArray(res.data?.topics) ? res.data.topics : 
                           Array.isArray(res.data?.data) ? res.data.data : 
                           Array.isArray(res.data) ? res.data : [];
        setTopics(topicsData);
      })
      .catch((err) => {
        console.error("Topics API Error:", err);
      });
  }, []);

  const startPractice = async (topicId: string) => {
    try {
      const res = await api.post("/practice/start", { topicId });
      router.push(`/practice/session/${res.data.sessionId}`);
    } catch (error) {
      console.error("Failed to start session", error);
    }
  };

  const levels = [
    { name: "Beginner", description: "Foundational phrases and basic grammar." },
    { name: "Intermediate", description: "Conversational skills and expanded vocabulary." },
    { name: "Advanced", description: "Complex topics and fluent expressions." },
  ];

  const filteredTopics = selectedLevel 
    ? topics.filter((t) => t.level?.toLowerCase() === selectedLevel.toLowerCase())
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-grow p-4 md:p-10 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-[#0B0909] mb-6">Learning Path</h1>
        <p className="text-gray-600 mb-8">
          Welcome to your structured learning path. Choose a level to see available topics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {levels.map((level) => (
            <button
              key={level.name}
              onClick={() => setSelectedLevel(level.name)}
              className={`bg-white p-6 rounded-xl shadow-sm border ${
                selectedLevel === level.name ? "border-[#B5B9F0] ring-2 ring-[#B5B9F0]" : "border-gray-100"
              } text-left hover:shadow-md transition cursor-pointer`}
            >
              <h2 className="font-semibold text-lg mb-2">{level.name}</h2>
              <p className="text-sm text-gray-500">{level.description}</p>
            </button>
          ))}
        </div>

        {selectedLevel && (
          <div>
            <h2 className="text-2xl font-bold text-[#0B0909] mb-6">{selectedLevel} Topics</h2>
            {filteredTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic._id}
                    onClick={() => startPractice(topic._id)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md transition group"
                  >
                    <h3 className="font-bold text-[#0B0909] text-lg mb-2 group-hover:text-[#2E4540]">{topic.title}</h3>
                    <p className="text-gray-600 text-sm">{topic.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No topics at this level yet.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
