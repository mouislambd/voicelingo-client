import { useState, useRef, useEffect } from "react";

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

export default function TryItLive() {
  const [micState, setMicState] = useState<"idle" | "Listening..." | "Analyzing...">("idle");
  const [feedback, setFeedback] = useState<{ feedback: string; hasMistake: boolean; correctedText?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setError("Voice input not supported in this browser.");
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new Recognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false; // Only one sentence
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
  }, []);

  const toggleMic = () => {
    if (micState === "idle") {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
      setMicState("idle");
    }
  };

  return (
    <section className="py-16 bg-white text-[#0B0909] px-6">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-bold">Try It Right Now — No Sign-Up Needed</h2>
        <p className="text-lg text-gray-600">Say a sentence in English and see instant feedback</p>
        
        <button
          onClick={toggleMic}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            micState === "Listening..." ? "bg-[#B5B9F0] animate-pulse" : "bg-[#2E4540] hover:bg-[#2E4540]/90"
          }`}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>
        </button>
        <p className="font-semibold text-[#2E4540]">{micState}</p>
        
        {error && <p className="text-red-500 font-medium">{error}</p>}

        {feedback && (
          <div className="mt-6 p-6 bg-[#B5B9F0]/20 rounded-2xl border border-[#B5B9F0] text-left">
            <h3 className="font-bold text-[#2E4540] mb-2">AI Feedback:</h3>
            <p className="text-gray-800">{feedback.feedback}</p>
            {feedback.correctedText && <p className="text-sm text-gray-600 mt-2">Corrected: <em>{feedback.correctedText}</em></p>}
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Want full conversations with instant feedback?</p>
            <a href="/register" className="text-[#2E4540] font-bold hover:underline">Sign up free</a>
        </div>
      </div>
    </section>
  );
}
