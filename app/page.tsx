"use client";

import CustomPracticeSection from "@/components/CustomPracticeSection";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TryItLive from "@/components/TryItLive";
import StatsSection from "@/components/StatsSection";
import ClosingLearningVisual from "@/components/ClosingLearningVisual";
import { useSession } from "@/src/lib/auth-client";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";

const HeroMicVisual = dynamic(() => import("@/components/HeroMicVisual"), { ssr: false });
const ClosingVisual = dynamic(() => import("@/components/ClosingLearningVisual"), { ssr: false });

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1 
    } 
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function LandingPage() {
  const { data: session } = useSession();
  const authLink = session ? "/practice" : "/register";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-0"> {/* Removed pt to eliminate gap for sticky Navbar */}
      
        {/* Hero Section */}
        <section className="relative text-white py-32 px-6 overflow-hidden">
          {/* Background Video */}
          <video
            src="/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#0B0909]/60 z-10" />
          
          {/* 3D Mic Visual (placed above video and overlay) */}
          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-20 pointer-events-none">
            <HeroMicVisual />
          </div>

          <motion.div 
            className="max-w-4xl mx-auto text-center relative z-30"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Speak English Fearlessly</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Practice real conversations with AI, get instant grammar and pronunciation feedback  no judgment, just growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={authLink} className="bg-[#B5B9F0] text-[#0B0909] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#a1a5e0] transition">
                Start Practicing
              </Link>
              <a href="#how-it-works" className="border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                How It Works
              </a>
            </div>
          </motion.div>
        </section>

        {/* Conditionally render TryItLive for logged-out users */}
        {!session && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <TryItLive />
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <CustomPracticeSection />
        </motion.div>

        {/* How It Works Section */}
        <motion.section 
          id="how-it-works" 
          className="py-20 px-6 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <h2 className="text-4xl font-bold text-[#0B0909] text-center mb-16">How It Works</h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={gridVariants}
          >
            {[
              { title: "Pick a Topic", desc: "Choose from curated conversation topics." },
              { title: "Speak Naturally", desc: "Talk using your microphone, AI listens in real-time." },
              { title: "Get Instant Feedback", desc: "Receive grammar corrections, pronunciation tips, and a score." },
            ].map((step, index) => (
              <motion.div key={index} className="text-center" variants={cardVariants}>
                <div className="w-16 h-16 bg-[#B5B9F0] text-[#0B0909] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-[#0B0909] mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          {/* Mini-CTA */}
          <div className="text-center mt-12">
            <Link href={authLink} className="text-[#2E4540] font-bold text-lg hover:underline">
              Ready to start? {session ? "Go to practice" : "Sign up and try it"}
            </Link>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-20 px-6 bg-[#F9FAFB]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0B0909] text-center mb-16">Why VoiceLingo?</h2>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={gridVariants}
            >
              {[
                { title: "Real-time Voice", desc: "Speak directly with AI.", path: "/practice" },
                { title: "AI-Powered Feedback", desc: "Uses Groq Llama 3.3 for accuracy.", path: "/practice" },
                { title: "Track Your Progress", desc: "Monitor weak areas and scores.", path: "/dashboard" },
                { title: "Practice Anytime", desc: "Session history at your fingertips.", path: "/dashboard" },
              ].map((feature, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <Link 
                      href={session ? feature.path : "/register"} 
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 block hover:shadow-lg hover:-translate-y-1 transform transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-[#B5B9F0]/20 rounded-lg mb-4" />
                    <h3 className="font-bold text-[#0B0909] mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Why We Built This Section */}
        <motion.section 
          className="py-20 px-6 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#B5B9F0]/20 transition-transform duration-300 ease-out h-[300px] md:h-[500px] lg:h-[600px]"
              style={{
                perspective: "1000px"
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-(y * 10)}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
              }}
            >
              <Image 
                src="/mission-visual.png" 
                alt="VoiceLingo Mission" 
                fill
                className="object-cover"
              />
            </div>
            
            {/* Content side */}
            <div>
              <h2 className="text-4xl font-bold text-[#0B0909] mb-6">Why We Built This</h2>
              <p className="text-lg text-gray-600 mb-10">We believe language learning shouldn't be stressful or transactional. Here's why we created VoiceLingo.</p>
              
              <div className="space-y-8">
                {[
                  { title: "Judgment-Free Practice", desc: "Practicing English should feel safe, not stressful." },
                  { title: "Mindful by Design", desc: "Session data auto-deletes after 30 days; we don't hoard what we don't need." },
                  { title: "Real Conversations", desc: "Not drills, actual back-and-forth voice practice with feedback." },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#B5B9F0] transition-all duration-300 cursor-default"
                    style={{ marginTop: i === 0 ? "0" : i === 1 ? "2rem" : "4rem" }}
                  >
                    <div className="absolute top-2 right-4 text-6xl font-bold text-[#B5B9F0]/10 select-none pointer-events-none">
                      0{i + 1}
                    </div>
                    <h3 className="text-xl font-bold text-[#0B0909] mb-2 relative z-10">{item.title}</h3>
                    <p className="text-gray-600 relative z-10">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 px-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <h2 className="text-4xl font-bold text-[#0B0909] mb-8">Ready to improve your spoken English?</h2>
          <Link href={authLink} className="bg-[#B5B9F0] text-[#0B0909] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#a1a5e0] transition">
            {session ? "Start Practicing" : "Get Started Free"}
          </Link>
        </motion.section>

        <StatsSection />

        {/* Closing Section */}
        <motion.section 
          className="py-20 px-6 bg-white border-t border-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl font-bold text-[#0B0909] mb-6">Your English Journey Starts Here</h2>
              <Link href={authLink} className="inline-block bg-[#B5B9F0] text-[#0B0909] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#a1a5e0] transition">
                {session ? "Start Practicing" : "Get Started Free"}
              </Link>
            </div>
            <div className="md:w-1/2">
              <ClosingVisual />
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
