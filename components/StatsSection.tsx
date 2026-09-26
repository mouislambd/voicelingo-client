"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Counter = ({ end, isVisible }: { end: number; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible || count >= end) return;
    const duration = 2000;
    const startTime = performance.now();
    const startCount = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * (end - startCount) + startCount));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end]);

  return <span>{count.toLocaleString()}</span>;
};

export default function StatsSection() {
  const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    axios.get("/api/stats")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (error) return null;

  return (
    <section ref={ref} className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div className="text-center p-8 bg-[#F9FAFB] rounded-2xl border border-gray-100">
          <div className="text-4xl font-bold text-[#2E4540] mb-2">
            <Counter end={stats.totalUsers} isVisible={isVisible} />
          </div>
          <div className="text-[#0B0909] font-medium">Learners Practicing</div>
        </div>
        <div className="text-center p-8 bg-[#F9FAFB] rounded-2xl border border-gray-100">
          <div className="text-4xl font-bold text-[#2E4540] mb-2">
            <Counter end={stats.totalSessions} isVisible={isVisible} />
          </div>
          <div className="text-[#0B0909] font-medium">Conversations Completed</div>
        </div>
      </div>
    </section>
  );
}
