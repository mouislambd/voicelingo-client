"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { api } from "@/src/lib/api";

// Web Speech API interfaces
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onstart?: (event: any) => void;
  onend?: (event: any) => void;
}
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export default function SessionPage() {
  const { sessionId } = useParams();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [micState, setMicState] = useState<"idle" | "Listening..." | "Thinking..." | "Speaking...">("idle");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSpeakingRef = useRef(false);

  // Refs to avoid stale closures
  const isConversationActiveRef = useRef(isConversationActive);
  const micStateRef = useRef(micState);
  const sendMessageRef = useRef<(text: string) => Promise<void>>(async () => {});
  const speakRef = useRef<(text: string) => void>(() => {});

  useEffect(() => { isConversationActiveRef.current = isConversationActive; }, [isConversationActive]);
  useEffect(() => { micStateRef.current = micState; }, [micState]);

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
  }, [session, isPending, router]);

  const sendMessage = async (text: string) => {
    setMicState("Thinking...");
    console.log("State transition: Thinking...");
    const newMessage = { role: "student", content: text };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const res = await api.post("/api/practice/message", { sessionId, message: text });
      const aiReply = { role: "ai", content: res.data.reply, feedback: res.data.feedback };
      setMessages((prev) => [...prev, aiReply]);
      speakRef.current?.(res.data.reply);
    } catch (err) {
      console.warn("API practice message failed:", err);
      // Restart only if conversation is still supposed to be active
      if (isConversationActiveRef.current) {
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
    console.log("State transition: Speaking...");
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      isSpeakingRef.current = false;
      console.log("AI finished speaking. State transition: Listening...");
      if (isConversationActiveRef.current) {
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
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setError("Voice input is not supported in this browser.");
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new Recognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("State transition: Listening...");
      setMicState("Listening...");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        console.log("Final result received, sending to AI:", finalTranscript);
        recognition.stop();
        sendMessageRef.current?.(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      // 'no-speech' is expected during pauses, log as warning to avoid dev overlay
      if (event.error === 'no-speech') {
        console.warn("Speech recognition: no-speech detected (expected during pauses).");
      } else {
        console.error("Speech recognition error:", event.error);
        setError(`Voice input error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended.");
      // Added a small delay before checking if we should restart
      setTimeout(() => {
        console.log("Restart check:", { active: isConversationActiveRef.current, speaking: isSpeakingRef.current, state: micStateRef.current });
        if (isConversationActiveRef.current && !isSpeakingRef.current && micStateRef.current !== "Thinking...") {
          try {
            console.log("Attempting to restart recognition...");
            recognition.start();
          } catch (e) {
            console.log("Recognition already started or error:", e);
          }
        }
      }, 500);
    };
  }, []);

  const toggleConversation = () => {
    if (isConversationActive) {
      console.log("Conversation ended.");
      console.trace();
      recognitionRef.current?.stop();
      setIsConversationActive(false);
      setMicState("idle");
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    } else {
      setIsConversationActive(true);
      setError(null);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.log("Recognition already started");
      }
    }
  };

  const endSession = async () => {
    // Just navigate to the summary page, letting the summary page call the endSession API
    router.push(`/practice/session/${sessionId}/summary`);
  };

  if (isPending || !session) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <header className="bg-white p-4 shadow-sm border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#0B0909]">Practice Session</h1>
        <button 
          onClick={endSession} 
          className="border border-red-400 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-50 transition"
        >
          End Session
        </button>
      </header>

      <main className="flex-grow p-6 max-w-2xl mx-auto w-full space-y-4">
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}`} className={`flex ${m.role === "student" ? "justify-end" : "justify-start"}`}>
            <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === "student" ? "bg-[#B5B9F0] text-[#0B0909]" : "bg-white border border-gray-100 shadow-sm"}`}>
              {m.content}
              {m.feedback?.hasMistake && (
                <p className="text-xs text-red-500 mt-2 italic">Note: {m.feedback.mistakeNote}</p>
              )}
            </div>
          </div>
        ))}
        {micState === "Thinking..." && <div className="text-gray-500 italic">AI is thinking...</div>}
      </main>

        <footer className="p-6 flex flex-col items-center gap-4">
        {micState !== "idle" && (
          <div className="text-lg font-bold text-[#2E4540] animate-pulse">
            {micState}
          </div>
        )}
        <button
          onClick={toggleConversation}
          className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
            isConversationActive 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-[#2E4540] hover:bg-[#2E4540]/90 text-white"
          }`}
        >
          {isConversationActive ? "End Conversation" : "Start Conversation"}
        </button>
      </footer>
    </div>
  );
}
