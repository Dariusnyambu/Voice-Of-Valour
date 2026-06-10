"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock3, MapPin, ArrowRight, HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ministers } from "@/data/ministers";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % ministers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + ministers.length) % ministers.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % ministers.length);
  };

  const minister = ministers[current];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #0B0B0B 0%, #1a1000 30%, #2d1a00 60%, #0B0B0B 100%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245, 179, 1, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 179, 1, 0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gold radial glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,179,1,0.1) 0%, transparent 70%)",
        }}
      />

      {/* SLIDING MINISTER — full-height background figure */}
      <div className="absolute inset-0 z-10 flex items-end justify-center overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={minister.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 120 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -120 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute bottom-0 flex items-end justify-center"
            style={{ height: "82vh", width: "100%" }}
          >
            <img
              src={minister.photo}
              alt={minister.name}
              className="h-full object-contain object-bottom select-none"
              style={{
                maskImage: "linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)",
                filter: "drop-shadow(0 0 60px rgba(245,179,1,0.2))",
                opacity: 0.35,
                maxWidth: "460px",
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom fade into page */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #111827)" }}
      />

      {/* Main Content */}
      <div className="relative z-30 text-center px-4 max-w-5xl mx-auto pt-28 pb-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-5"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-400/40 shadow-lg"
            style={{ boxShadow: "0 0 30px rgba(245,179,1,0.3)" }}>
            <img src="/logo.png" alt="Voice of Valour" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Season badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-5"
        >
          <span className="section-badge">✦ Season 4 ✦</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-black text-white mb-4"
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            lineHeight: 1.05,
            textShadow: "0 0 60px rgba(245,179,1,0.4)",
          }}
        >
          VOICE OF{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F5B301 0%, #FFE7A0 50%, #D89A00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VALOUR
          </span>
        </motion.h1>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-3"
        >
          <p className="text-yellow-400/80 font-semibold tracking-widest uppercase text-sm md:text-base" style={{ letterSpacing: "0.2em" }}>
            Theme:
          </p>
          <p className="text-white text-xl md:text-3xl font-bold mt-1" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
            &ldquo;O Come To Jesus, The Messiah&rdquo;
          </p>
        </motion.div>

        {/* Scripture */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-yellow-400/60 text-sm md:text-base mb-8 italic"
        >
          Luke 4:18-19
        </motion.p>

        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8"
        >
          {[
            { icon: CalendarDays, label: "3 July 2026" },
            { icon: Clock3, label: "9 PM Till Dawn" },
            { icon: MapPin, label: "FGCK Christ Centre, Kasarani" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/70 text-sm md:text-base">
              <Icon size={16} className="text-yellow-400 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <button
            onClick={() => scrollTo("register")}
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full text-black font-bold text-base transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #F5B301, #D89A00)", boxShadow: "0 4px 30px rgba(245,179,1,0.4)" }}
          >
            Register Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollTo("partnership")}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base border-2 border-yellow-400/60 text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
          >
            <HeartHandshake size={18} />
            Become A Partner
          </button>
        </motion.div>

        {/* Minister Slider Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Current minister name */}
          <AnimatePresence mode="wait">
            <motion.div
              key={minister.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-yellow-400/80 text-xs uppercase tracking-widest font-semibold">Featuring</p>
              <p className="text-white font-bold text-sm mt-0.5" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                {minister.name}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Dots / Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-yellow-400 transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex gap-1.5">
              {ministers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "20px" : "6px",
                    height: "6px",
                    background: i === current ? "#F5B301" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-yellow-400 transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
