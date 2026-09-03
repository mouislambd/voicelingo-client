"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { api } from "@/src/lib/api";
import { Mic, CheckCircle, Lightbulb, RefreshCcw } from "lucide-react";

type Message = {
    role: "user" | "ai";
    text: string;
    feedback?: { feedback: string; hasMistake: boolean; correctedText?: string };
};

export default function CustomPracticeSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"text" | "voice">("text");
  
  // Text tab state
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Voice tab state
  const [messages, setMessages] = useState<Message[]>([]);
  const [micState, setMicState] = useState<"idle" | "Listening..." | "Analyzing...">("idle");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (activeTab === "voice") {
        if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            setError("Voice input not supported in this browser.");
            return;
        }
        const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new Recognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setMicState("Listening...");
            setError(null);
        };

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            setMessages(prev => [...prev, { role: "user", text: transcript }]);
            setMicState("Analyzing...");
            
            try {
                const response = await fetch("/api/demo/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: transcript }),
                });
                
                if (!response.ok) {
                    throw new Error("Failed to get feedback.");
                }
                
                const data = await response.json();
                setMessages(prev => [...prev, { role: "ai", text: data.feedback, feedback: data }]);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setMicState("idle");
            }
        };

        recognition.onerror = (event: any) => {
            setError(`Error: ${event.error}`);
            setMicState("idle");
        };
        
        recognition.onend = () => {
            if (micState === "Listening...") setMicState("idle");
        };
    }
  }, [activeTab]);

  const toggleMic = () => {
    if (micState === "idle") {
        recognitionRef.current?.start();
    } else if (micState === "Listening...") {
        recognitionRef.current?.stop();
        setMicState("idle");
    }
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
        
        {activeTab === "text" && (
            <>
                <textarea 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic..."
                  className="w-full p-4 rounded-xl border border-gray-200 mb-4"
                />
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button 
                  onClick={handleStartSession}
                  disabled={loading || !topic.trim()}
                  className="w-full bg-[#B5B9F0] text-[#0B0909] py-4 rounded-full font-bold hover:bg-[#a1a5e0] transition disabled:opacity-50"
                >
                  {loading ? "Starting..." : "Create Practice Session"}
                </button>
            </>
        )}

        {activeTab === "voice" && (
            <div className="space-y-4">
                <div className="h-64 overflow-y-auto bg-white p-4 rounded-xl border border-gray-200 mb-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`p-3 rounded-lg ${msg.role === "user" ? "bg-blue-100 ml-auto w-fit" : "bg-green-100 mr-auto w-fit"}`}>
                            <p>{msg.text}</p>
                            {msg.feedback && msg.feedback.correctedText && (
                                <p className="text-xs text-green-700 italic mt-1">Correction: {msg.feedback.correctedText}</p>
                            )}
                        </div>
                    ))}
                    {micState === "Analyzing..." && <p className="text-sm text-gray-500">Analyzing...</p>}
                </div>

                <button 
                    onClick={toggleMic}
                    className={`w-full py-4 rounded-full font-bold ${micState === "Listening..." ? "bg-red-500 text-white" : "bg-[#2E4540] text-white"}`}
                >
                    {micState === "Listening..." ? "Listening..." : "Click to Speak"}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        )}
      </div>
    </section>
  );
}
