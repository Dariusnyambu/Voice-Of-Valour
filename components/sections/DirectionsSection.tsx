"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/h9sqsyTtDnSRt2mF9";

export default function DirectionsSection() {
  return (
    <section id="directions" className="py-24 relative" style={{ background: "#0B0F1A" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-badge inline-flex mb-4"
          >
            📍 Directions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mt-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Find{" "}
            <span style={{ background: "linear-gradient(135deg, #F5B301, #FFE7A0, #D89A00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              The Venue
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(245,179,1,0.2)", height: "400px" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.759!2d36.900!3d-1.225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zFGCK+Christ+Centre+Kasarani!5e0!3m2!1sen!2ske!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(200deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Venue Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card p-6" style={{ borderColor: "rgba(245,179,1,0.2)" }}>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(245,179,1,0.15), rgba(245,179,1,0.05))", border: "1px solid rgba(245,179,1,0.2)" }}
                >
                  <MapPin size={22} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                    FGCK Christ Centre
                  </h3>
                  <p className="text-white/60 mt-1">Kasarani, Clay City</p>
                  <p className="text-white/60">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6" style={{ borderColor: "rgba(245,179,1,0.1)" }}>
              <h4 className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-4">Event Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Date</span>
                  <span className="text-white font-medium">Friday, 3 July 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Time</span>
                  <span className="text-white font-medium">9:00 PM – Till Dawn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Venue</span>
                  <span className="text-white font-medium">FGCK Christ Centre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Location</span>
                  <span className="text-white font-medium">Kasarani, Clay City</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Entry</span>
                  <span className="text-yellow-400 font-semibold">FREE</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-black text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #F5B301, #D89A00)", boxShadow: "0 4px 20px rgba(245,179,1,0.3)" }}
              >
                <Navigation size={16} />
                Get Directions
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-yellow-400 text-sm border-2 border-yellow-400/60 hover:bg-yellow-400/10 transition-all"
              >
                <ExternalLink size={16} />
                Open Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
