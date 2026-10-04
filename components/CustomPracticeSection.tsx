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
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [micState, setMicState] = useState<"idle" | "Listening..." | "Thinking..." | "Speaking...">("idle");
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef(false);
  const isRecognitionActiveRef = useRef(false);
  const isConversationActiveRef = useRef(isConversationActive);
  const micStateRef = useRef(micState);
  
  const sendMessageRef = useRef<(text: string) => Promise<void>>(async () => {});
  const speakRef = useRef<(text: string) => void>(() => {});

  useEffect(() => { isConversationActiveRef.current = isConversationActive; }, [isConversationActive]);
  useEffect(() => { micStateRef.current = micState; }, [micState]);

  const sendMessage = async (text: string) => {
    setMicState("Thinking...");
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const response = await fetch("/api/demo/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) throw new Error("Failed to get feedback.");
      
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.feedback, feedback: data }]);
      speakRef.current(data.feedback);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      if (isConversationActiveRef.current && !isRecognitionActiveRef.current) {
        setMicState("Listening...");
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.log("Recognition start failed after error:", e);
        }
      } else {
        setMicState("idle");
      }
    }
  };

  const speak = (text: string) => {
    isSpeakingRef.current = true;
    setMicState("Speaking...");
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (isConversationActiveRef.current && !isRecognitionActiveRef.current) {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.log("Recognition already started");
        }
      }
    };
    window.speechSynthesis.speak(utterance);
  };
  
  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);
  useEffect(() => { speakRef.current = speak; }, [speak]);

  useEffect(() => {
    if (activeTab !== "voice") return;
    
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        setError("Voice input not supported in this browser.");
        return;
    }
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new Recognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
        setMicState("Listening...");
        isRecognitionActiveRef.current = true;
    };

    recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript) {
            recognition.stop();
            sendMessageRef.current?.(finalTranscript);
        }
    };

    recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
            console.error("Speech recognition error:", event.error);
            setError(`Error: ${event.error}`);
            setMicState("idle");
        }
    };
    
    recognition.onend = () => {
        isRecognitionActiveRef.current = false;
        setTimeout(() => {
            if (isConversationActiveRef.current && !isSpeakingRef.current && micStateRef.current !== "Thinking..." && !isRecognitionActiveRef.current) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log("Recognition error on restart:", e);
                }
            }
        }, 500);
    };
  }, [activeTab]);

  const toggleConversation = () => {
    if (isConversationActive) {
      recognitionRef.current?.stop();
      setIsConversationActive(false);
      setMicState("idle");
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    } else {
      setIsConversationActive(true);
      setError(null);
      if (!isRecognitionActiveRef.current) {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.log("Recognition already started");
        }
      }
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
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-white text-center mb-10">Custom Topic Practice</h2>
      
      <div className="flex justify-center gap-4 mb-8">
        {["text", "voice"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "text" | "voice")}
            className={`px-6 py-2 rounded-full font-bold capitalize ${activeTab === tab ? "bg-[#2E4540] text-white" : "bg-[#2a3a34] text-gray-300 hover:bg-[#3d554e]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#B5B9F0]/10 p-8 rounded-3xl animate-border-pulse">
        
        {activeTab === "text" && (
            <>
                <div className="border-2 border-[#B5B9F0] rounded-xl shadow-[0_0_15px_rgba(181,185,240,0.3)] focus-within:border-white transition-colors mb-4">
                  <textarea 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic..."
                    className="w-full p-4 rounded-xl bg-transparent text-white focus:outline-none placeholder:text-gray-400"
                  />
                </div>
                
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

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
                <div className="border-2 border-[#B5B9F0] rounded-xl shadow-[0_0_15px_rgba(181,185,240,0.3)] p-4 mb-4">
                  <div className="h-64 overflow-y-auto bg-[#1a2420] rounded-xl p-4 space-y-4">
                      {messages.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                                msg.role === "user" 
                                    ? "bg-[#2a3a34] border-[#B5B9F0] text-white ml-auto w-fit" 
                                    : "bg-[#2E4540] text-white mr-auto w-fit"
                            }`}
                          >
                              <p>{msg.text}</p>
                              {msg.feedback && msg.feedback.correctedText && (
                                  <p className="text-xs text-[#B5B9F0] italic mt-1">Correction: {msg.feedback.correctedText}</p>
                              )}
                          </div>
                      ))}
                      {micState === "Thinking..." && <p className="text-sm text-gray-400">Thinking...</p>}
                  </div>
                </div>

                <button 
                    onClick={toggleConversation}
                    disabled={micState === "Thinking..."}
                    className={`w-full py-4 rounded-full font-bold transition-all ${
                        isConversationActive 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-[#2E4540] hover:bg-[#2E4540]/90 text-white"
                    }`}
                >
                    {isConversationActive ? "End Conversation" : "Start Conversation"}
                </button>
                {micState !== "idle" && (
                  <div className="text-center text-sm font-medium text-[#B5B9F0] animate-pulse">
                    {micState}
                  </div>
                )}
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        )}
      </div>
    </section>
  );
}
