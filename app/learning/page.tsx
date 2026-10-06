"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LearningPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-grow p-4 md:p-10 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-[#0B0909] mb-6">Learning Path</h1>
        <p className="text-gray-600 mb-8">
          Welcome to your structured learning path. Choose a topic to begin your journey.
        </p>
        {/* Add lesson library components here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-2">Beginner</h2>
            <p className="text-sm text-gray-500">Foundational phrases and basic grammar.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-2">Intermediate</h2>
            <p className="text-sm text-gray-500">Conversational skills and expanded vocabulary.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-2">Advanced</h2>
            <p className="text-sm text-gray-500">Complex topics and fluent expressions.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
