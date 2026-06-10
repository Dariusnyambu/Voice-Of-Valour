"use client";

import { motion } from "framer-motion";
import { Music, Mic2, Church, Heart, Sparkles, Flame } from "lucide-react";

const highlights = [
  {
    icon: Music,
    title: "Worship",
    description: "Experience powerful, spirit-filled worship that transcends ordinary and ushers you into the very presence of God.",
  },
  {
    icon: Flame,
    title: "Revival",
    description: "A night of Holy Spirit-led revival where chains are broken, lives are transformed, and destinies are realigned.",
  },
  {
    icon: Heart,
    title: "Prayer",
    description: "Corporate intercession and prayer that moves mountains. Come expectant for breakthrough and divine encounters.",
  },
  {
    icon: Church,
    title: "Fellowship",
    description: "Connect with believers from across Kenya and beyond. Build lasting relationships in the body of Christ.",
  },
  {
    icon: Mic2,
    title: "Music Ministry",
    description: "Anointed ministers will lead us through an immersive musical worship experience from 9PM until the dawn breaks.",
  },
  {
    icon: Sparkles,
    title: "Impartation",
    description: "Receive fresh impartation of the Spirit. Leave carrying a new fire, purpose, and supernatural empowerment.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-badge inline-flex mb-4"
          >
            ✦ About The Event
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mt-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            One Night.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F5B301 0%, #FFE7A0 50%, #D89A00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Infinite Glory.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto mt-4 text-base md:text-lg"
          >
            Voice Of Valour Season 4 is a night of intensive worship, revival, and encounter with Jesus the Messiah.
            Rooted in Luke 4:18-19, this gathering calls all to come and experience the liberating power of Christ.
          </motion.p>
        </div>

        {/* Scripture Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto mb-16 relative overflow-hidden"
          style={{ borderColor: "rgba(245,179,1,0.3)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(245,179,1,0.06) 0%, transparent 70%)" }}
          />
          <p
            className="text-yellow-400/60 text-xs tracking-widest uppercase font-semibold mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            Scripture Reference
          </p>
          <blockquote
            className="text-white text-lg md:text-2xl font-medium leading-relaxed italic mb-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            &ldquo;The Spirit of the Lord is upon me, because he has anointed me to proclaim good news to the poor.
            He has sent me to proclaim liberty to the captives and recovering of sight to the blind,
            to set at liberty those who are oppressed...&rdquo;
          </blockquote>
          <p className="text-yellow-400 font-bold text-sm tracking-widest">— Luke 4:18-19</p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 hover:border-yellow-400/30 transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ background: "linear-gradient(135deg, rgba(245,179,1,0.15), rgba(245,179,1,0.05))", border: "1px solid rgba(245,179,1,0.2)" }}
              >
                <item.icon size={22} className="text-yellow-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                {item.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
