"use client";

import { useState, useRef, useEffect } from "react";
import { SpeechRecognition } from "@/src/types/speech";
import { Mic, CheckCircle, Lightbulb, RefreshCcw } from "lucide-react";

export default function TryItLive() {
  const [micState, setMicState] = useState<"idle" | "Listening..." | "Analyzing...">("idle");
  const [feedback, setFeedback] = useState<{ feedback: string; hasMistake: boolean; correctedText?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const exampleSentences = [
    "I want to improve my English skills.",
    "Could you help me with my pronunciation?",
    "I am practicing for a job interview."
  ];

  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setError("Voice input not supported in this browser.");
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new Recognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setMicState("Listening...");
      setError(null);
      setFeedback(null);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setMicState("Analyzing...");
      
      try {
        const response = await fetch("/api/demo/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript }),
        });
        
        if (!response.ok) {
            if (response.status === 429) throw new Error("Too many requests! Try again in a moment.");
            throw new Error("Failed to get feedback.");
        }
        
        const data = await response.json();
        setFeedback(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setMicState("idle");
      }
    };

    recognition.onerror = (event) => {
      setError(`Error: ${event.error}`);
      setMicState("idle");
    };
    
    recognition.onend = () => {
        if (micState === "Listening...") setMicState("idle");
    };
  }, [micState]);

  const toggleMic = () => {
    if (micState === "idle") {
      recognitionRef.current?.start();
    } else if (micState === "Listening...") {
      recognitionRef.current?.stop();
      setMicState("idle");
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#2E4540]/10 via-white to-[#B5B9F0]/10 text-[#0B0909]">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-4xl font-bold tracking-tight">Try It Right Now</h2>
        <p className="text-xl text-gray-600">No sign-up needed. Say a sentence to get instant feedback.</p>
        
        <div className="flex justify-center gap-2 flex-wrap mb-8">
            {exampleSentences.map((s, i) => (
                <button key={i} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition" onClick={() => {}}>
                    "{s}"
                </button>
            ))}
        </div>

        <div className="relative inline-block">
            <button
                onClick={toggleMic}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                    micState === "Listening..." 
                    ? "bg-[#B5B9F0] shadow-[0_0_30px_10px_rgba(181,185,240,0.5)]" 
                    : "bg-[#2E4540] hover:bg-[#2E4540]/90 shadow-lg hover:shadow-xl"
                }`}
            >
                {micState === "Listening..." && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-[#B5B9F0] animate-ping"></span>
                        <span className="absolute inset-0 rounded-full bg-[#B5B9F0] animate-pulse"></span>
                    </>
                )}
                {micState === "Analyzing..." ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Mic className="w-10 h-10 text-white relative z-10" />
                )}
            </button>
            {micState === "idle" && (
                <p className="absolute -bottom-8 left-0 right-0 text-sm font-medium text-[#2E4540] animate-bounce">
                    Tap to speak
                </p>
            )}
        </div>
        
        <p className="font-semibold text-[#2E4540] pt-6">{micState}</p>
        
        {error && <p className="text-red-500 font-medium p-4 bg-red-50 rounded-xl">{error}</p>}

        {feedback && (
          <div className="mt-8 p-6 bg-white rounded-3xl border border-[#B5B9F0]/30 shadow-xl shadow-[#B5B9F0]/10 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-[#2E4540] mb-3 flex items-center gap-2">
                {feedback.hasMistake ? <Lightbulb className="w-5 h-5" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
                AI Feedback:
            </h3>
            <p className="text-gray-800 text-lg leading-relaxed">{feedback.feedback}</p>
            {feedback.correctedText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Corrected version:</p>
                    <p className="text-lg text-[#2E4540] font-medium italic underline decoration-green-500 decoration-2 underline-offset-4">
                        {feedback.correctedText}
                    </p>
                </div>
            )}
            <button onClick={() => setFeedback(null)} className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-[#2E4540] transition">
                <RefreshCcw className="w-4 h-4" /> Try another sentence
            </button>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 mb-4">Want full conversations with instant feedback?</p>
            <a href="/register" className="inline-block bg-[#2E4540] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2E4540]/90 transition">
                Sign up free
            </a>
        </div>
      </div>
    </section>
  );
}
