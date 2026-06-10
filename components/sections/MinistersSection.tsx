"use client";

import { motion } from "framer-motion";
import { AtSign, Globe, Share2 } from "lucide-react";
import { ministers } from "@/data/ministers";

export default function MinistersSection() {
  return (
    <section id="ministers" className="py-24 relative overflow-hidden" style={{ background: "#0B0F1A" }}>
      {/* Gold glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(245,179,1,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-badge inline-flex mb-4"
          >
            🎤 Ministers
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mt-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Anointed{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F5B301 0%, #FFE7A0 50%, #D89A00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Vessels
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 mt-4 max-w-xl mx-auto"
          >
            Spirit-filled ministers who will lead us into an extraordinary encounter with Jesus the Messiah.
          </motion.p>
        </div>

        {/* Ministers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {ministers.map((minister, i) => (
            <motion.div
              key={minister.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl"
              style={{ border: "1px solid rgba(245,179,1,0.15)" }}
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-b from-yellow-900/20 to-black">
                <img
                  src={minister.photo}
                  alt={minister.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }}
                />
              </div>

              {/* Info */}
              <div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{ background: "linear-gradient(to top, rgba(11,11,11,0.95) 0%, transparent 100%)" }}
              >
                <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  {minister.name}
                </h3>
                <p className="text-yellow-400/70 text-xs mt-0.5">{minister.title}</p>

                {/* Social Links */}
                <div className="flex gap-2 mt-2">
                  {minister.instagram && (
                    <a href={minister.instagram} className="text-white/40 hover:text-yellow-400 transition-colors">
                      <AtSign size={14} />
                    </a>
                  )}
                  {minister.twitter && (
                    <a href={minister.twitter} className="text-white/40 hover:text-yellow-400 transition-colors">
                      <Globe size={14} />
                    </a>
                  )}
                  {minister.facebook && (
                    <a href={minister.facebook} className="text-white/40 hover:text-yellow-400 transition-colors">
                      <Share2 size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Hover Bio */}
              <div
                className="absolute inset-0 p-5 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(11,11,11,0.95)" }}
              >
                <div
                  className="w-10 h-10 rounded-full mb-3 overflow-hidden border-2"
                  style={{ borderColor: "rgba(245,179,1,0.5)" }}
                >
                  <img src={minister.photo} alt={minister.name} className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="text-yellow-400 font-bold text-sm mb-1" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  {minister.name}
                </h3>
                <p className="text-white/50 text-xs mb-2">{minister.title}</p>
                <p className="text-white/70 text-xs leading-relaxed">{minister.bio}</p>
              </div>

              {/* Gold border bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(90deg, transparent, #F5B301, transparent)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
