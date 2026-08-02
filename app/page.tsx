"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TryItLive from "@/components/TryItLive";
import { useSession } from "@/src/lib/auth-client";

export default function LandingPage() {
  const { data: session } = useSession();
  const authLink = session ? "/practice" : "/register";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#2E4540] text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Speak English with Confidence</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Practice real conversations with AI, get instant grammar and pronunciation feedback — no judgment, just growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={authLink} className="bg-[#B5B9F0] text-[#0B0909] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#a1a5e0] transition">
                Start Practicing
              </Link>
              <a href="#how-it-works" className="border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                How It Works
              </a>
            </div>
          </div>
        </section>

        {/* Conditionally render TryItLive for logged-out users */}
        {!session && <TryItLive />}

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0B0909] text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Pick a Topic", desc: "Choose from curated conversation topics." },
              { title: "Speak Naturally", desc: "Talk using your microphone, AI listens in real-time." },
              { title: "Get Instant Feedback", desc: "Receive grammar corrections, pronunciation tips, and a score." },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#B5B9F0] text-[#0B0909] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-[#0B0909] mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          {/* Mini-CTA */}
          <div className="text-center mt-12">
            <Link href={authLink} className="text-[#2E4540] font-bold text-lg hover:underline">
              Ready to start? {session ? "Go to practice" : "Sign up and try it"}
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0B0909] text-center mb-16">Why VoiceLingo?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Real-time Voice", desc: "Speak directly with AI." },
                { title: "AI-Powered Feedback", desc: "Uses Groq Llama 3.3 for accuracy." },
                { title: "Track Your Progress", desc: "Monitor weak areas and scores.", link: session ? "/dashboard" : undefined },
                { title: "Practice Anytime", desc: "Session history at your fingertips." },
              ].map((feature, i) => (
                feature.link ? (
                    <Link href={feature.link} key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 block hover:shadow-md transition">
                      <div className="w-10 h-10 bg-[#B5B9F0]/20 rounded-lg mb-4" />
                      <h3 className="font-bold text-[#0B0909] mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </Link>
                ) : (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="w-10 h-10 bg-[#B5B9F0]/20 rounded-lg mb-4" />
                      <h3 className="font-bold text-[#0B0909] mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                )
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-4xl font-bold text-[#0B0909] mb-8">Ready to improve your spoken English?</h2>
          <Link href={authLink} className="bg-[#B5B9F0] text-[#0B0909] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#a1a5e0] transition">
            {session ? "Start Practicing" : "Get Started Free"}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
