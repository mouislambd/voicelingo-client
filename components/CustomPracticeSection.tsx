"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { api } from "@/src/lib/api";

export default function CustomPracticeSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"text" | "voice">("text");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Web Speech API
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    
    setError(null);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTopic(transcript);
    };
    recognition.onerror = (event: any) => {
        console.error(event);
        setIsListening(false);
        setError("Error recognizing speech.");
    };

    recognition.start();
  };

  const handleStartSession = async () => {
    if (!session) {
      router.push("/register");
      return;
    }
    if (!topic.trim()) {
        setError("Please enter a topic.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/practice/start", {
        topic: topic,
        level: "intermediate"
      });
      router.push(`/practice/session/${res.data.sessionId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-white max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-[#0B0909] text-center mb-10">Custom Topic Practice</h2>
      
      <div className="flex justify-center gap-4 mb-8">
        {["text", "voice"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "text" | "voice")}
            className={`px-6 py-2 rounded-full font-bold capitalize ${activeTab === tab ? "bg-[#2E4540] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
        <textarea 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic..."
          className="w-full p-4 rounded-xl border border-gray-200 mb-4"
        />

        {activeTab === "voice" && (
            <button 
                onClick={startListening}
                className={`w-full py-4 mb-4 rounded-full font-bold ${isListening ? "bg-red-500 text-white" : "bg-gray-200 text-[#0B0909]"}`}
            >
                {isListening ? "Listening..." : "Click to Speak"}
            </button>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button 
          onClick={handleStartSession}
          disabled={loading || !topic.trim()}
          className="w-full bg-[#B5B9F0] text-[#0B0909] py-4 rounded-full font-bold hover:bg-[#a1a5e0] transition disabled:opacity-50"
        >
          {loading ? "Starting..." : "Create Practice Session"}
        </button>
      </div>
    </section>
  );
}
