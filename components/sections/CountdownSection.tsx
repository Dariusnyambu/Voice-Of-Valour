"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET_DATE = new Date("2026-07-03T21:00:00+03:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const diff = TARGET_DATE.getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div
        className="glass-card flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 relative overflow-hidden"
        style={{ borderColor: "rgba(245,179,1,0.3)" }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(245,179,1,0.08) 0%, transparent 70%)" }}
        />
        <span
          className="countdown-digit relative z-10 font-black"
          style={{
            fontSize: "clamp(1.8rem, 6vw, 4rem)",
            background: "linear-gradient(180deg, #FFE7A0 0%, #F5B301 50%, #D89A00 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "'Cinzel', Georgia, serif",
          }}
        >
          {display}
        </span>
      </div>
      <p className="text-white/50 text-xs sm:text-sm font-medium mt-2 tracking-widest uppercase">{label}</p>
    </div>
  );
}

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setStarted(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #111827 0%, #0B0F1A 100%)" }}>
      {/* Grid bg */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245, 179, 1, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 179, 1, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="section-badge mb-4 inline-flex">⏳ Countdown</span>
          <h2
            className="text-white text-3xl md:text-4xl font-black mt-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Event Begins In
          </h2>
          <p className="text-white/50 mt-2">3 July 2026 • 9:00 PM EAT</p>
        </motion.div>

        {started ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-yellow-400 text-3xl md:text-5xl font-black" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
              🎉 The Event Has Started!
            </p>
            <p className="text-white/60 mt-4">Join us at FGCK Christ Centre, Kasarani</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center gap-3 sm:gap-6 flex-wrap"
          >
            <CountdownUnit value={timeLeft.days} label="Days" />
            <div className="text-yellow-400 text-4xl font-black mt-[-16px] hidden sm:block" style={{ fontFamily: "'Cinzel', serif" }}>:</div>
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <div className="text-yellow-400 text-4xl font-black mt-[-16px] hidden sm:block" style={{ fontFamily: "'Cinzel', serif" }}>:</div>
            <CountdownUnit value={timeLeft.minutes} label="Minutes" />
            <div className="text-yellow-400 text-4xl font-black mt-[-16px] hidden sm:block" style={{ fontFamily: "'Cinzel', serif" }}>:</div>
            <CountdownUnit value={timeLeft.seconds} label="Seconds" />
          </motion.div>
        )}

        {/* Target date note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-white/30 text-sm mt-10"
        >
          FGCK Christ Centre • Kasarani, Clay City • Nairobi, Kenya
        </motion.p>
      </div>
    </section>
  );
}
