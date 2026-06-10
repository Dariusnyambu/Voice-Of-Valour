"use client";

import { MapPin, Clock3, CalendarDays, Mail, Phone, AtSign, Globe, Share2, PlayCircle } from "lucide-react";

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative pt-20 pb-8 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0B0F1A 0%, #080B13 100%)", borderTop: "1px solid rgba(245,179,1,0.1)" }}
    >
      {/* Gold glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(245,179,1,0.5), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-yellow-400/30 shrink-0">
                <img src="/logo.png" alt="Voice of Valour" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-black text-sm" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>VOICE OF VALOUR</p>
                <p className="text-yellow-400/60 text-xs">Season 4</p>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              O Come To Jesus, The Messiah. A night of worship, revival and encounter.
            </p>
            <div className="flex gap-3">
              {[AtSign, Globe, Share2, PlayCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-yellow-400 transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Event Details</h4>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-start gap-2">
                <CalendarDays size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                <span>Friday, 3 July 2026</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock3 size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                <span>9:00 PM — Till Dawn</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                <span>FGCK Christ Centre<br />Kasarani, Clay City<br />Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Quick Links</h4>
            <div className="space-y-2 text-sm">
              {[
                ["About Event", "about"],
                ["Ministers", "ministers"],
                ["Register", "register"],
                ["Become A Partner", "partnership"],
                ["Directions", "directions"],
                ["FAQ", "faq"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="block text-white/50 hover:text-yellow-400 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Contact</h4>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-yellow-400 shrink-0" />
                <a href="mailto:info@voiceofvalour.co.ke" className="hover:text-yellow-400 transition-colors">
                  info@voiceofvalour.co.ke
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-yellow-400 shrink-0" />
                <a href="tel:+254746102500" className="hover:text-yellow-400 transition-colors">
                  0746 102 500
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                <span>FGCK Christ Centre, Kasarani</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p>© 2026 Voice Of Valour Season 4. All rights reserved.</p>
          <p>
            Built with ❤️ by{" "}
            <a
              href="https://royal-graphix.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400/70 hover:text-yellow-400 transition-colors font-medium"
            >
              Royal Graphix
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
