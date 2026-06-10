"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Ministers", href: "#ministers" },
  { label: "Register", href: "#register" },
  { label: "Partner", href: "#partnership" },
  { label: "Directions", href: "#directions" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nav-blur py-3" : "py-5 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-yellow-400/30">
            <img src="/logo.png" alt="Voice of Valour" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-white text-sm tracking-wider hidden sm:block">VOICE OF VALOUR</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm text-white/70 hover:text-yellow-400 transition-colors font-medium"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => handleNav("#register")}
            className="px-5 py-2 rounded-full text-sm font-bold text-black"
            style={{ background: "linear-gradient(135deg, #F5B301, #D89A00)" }}
          >
            Register Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-1"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 nav-blur py-4 px-4"
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="block w-full text-left py-3 text-white/80 hover:text-yellow-400 transition-colors border-b border-white/5 text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#register")}
              className="mt-4 w-full py-3 rounded-full text-sm font-bold text-black"
              style={{ background: "linear-gradient(135deg, #F5B301, #D89A00)" }}
            >
              Register Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
