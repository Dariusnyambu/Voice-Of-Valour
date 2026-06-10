"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, HeartHandshake, Church, TrendingUp } from "lucide-react";
import { getAnalytics } from "@/lib/sheets";
import { Analytics } from "@/types";

function StatCard({ icon: Icon, label, value, delay }: { icon: React.ElementType; label: string; value: number; delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass-card p-6 text-center relative overflow-hidden group hover:border-yellow-400/30 transition-all"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,179,1,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "linear-gradient(135deg, rgba(245,179,1,0.15), rgba(245,179,1,0.05))", border: "1px solid rgba(245,179,1,0.2)" }}
      >
        <Icon size={22} className="text-yellow-400" />
      </div>
      <p
        className="font-black text-3xl md:text-4xl mb-1"
        style={{
          background: "linear-gradient(135deg, #F5B301 0%, #FFE7A0 50%, #D89A00 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontFamily: "'Cinzel', Georgia, serif",
        }}
      >
        {count.toLocaleString()}+
      </p>
      <p className="text-white/60 text-sm">{label}</p>
    </motion.div>
  );
}

export default function StatisticsSection() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    getAnalytics().then(setAnalytics);
  }, []);

  if (!analytics) return null;

  const stats = [
    { icon: Users, label: "Total Registrations", value: analytics.totalAttendees },
    { icon: HeartHandshake, label: "Partners", value: analytics.totalPartners },
    { icon: Church, label: "Churches Represented", value: analytics.churchesRepresented },
    { icon: TrendingUp, label: "Today's Registrations", value: analytics.todayRegistrations },
  ];

  return (
    <section className="py-20 relative" style={{ background: "#111827" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-badge inline-flex mb-4"
          >
            📊 Statistics
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mt-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Growing Together
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
