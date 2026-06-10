"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Who can attend Voice Of Valour Season 4?",
    a: "Voice of Valour Season 4 is open to all believers — young, old, pastors, church members, and anyone who wants to encounter Jesus the Messiah. All are welcome regardless of denomination.",
  },
  {
    q: "Is registration free?",
    a: "Yes! Registration and attendance for Voice of Valour Season 4 is completely free of charge. There are no ticket fees. However, we encourage attendees to register in advance so we can prepare adequately.",
  },
  {
    q: "Can churches attend as groups?",
    a: "Absolutely! Churches are encouraged to come as groups. When registering, select 'Group' as your attendance type. Group registrations help us accommodate your congregation effectively.",
  },
  {
    q: "How can I become a partner?",
    a: "Visit the Partnership section on this page to fill out the partner registration form. You can partner through financial support, music equipment provision, music performance support, or other forms. Our team will contact you to discuss the details.",
  },
  {
    q: "What should I carry to the event?",
    a: "Carry your Bible, a notebook, and something warm (the event runs from 9PM till dawn and it can get chilly). Come with an open heart ready to worship, pray, and receive from God.",
  },
  {
    q: "Is there parking available at the venue?",
    a: "FGCK Christ Centre, Kasarani has parking facilities. However, we encourage carpooling or using public transport where possible given the expected number of attendees.",
  },
  {
    q: "What is the theme for Season 4?",
    a: "'O Come To Jesus, The Messiah' — drawn from Luke 4:18-19. The night will center around encountering Jesus as the anointed one sent to proclaim liberty, healing, and good news.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative" style={{ background: "#111827" }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-badge inline-flex mb-4"
          >
            <HelpCircle size={12} className="mr-1" />
            FAQs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mt-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Frequently Asked{" "}
            <span style={{ background: "linear-gradient(135deg, #F5B301, #FFE7A0, #D89A00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Questions
            </span>
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div
                className="glass-card overflow-hidden transition-all duration-300"
                style={{ borderColor: open === i ? "rgba(245,179,1,0.3)" : "rgba(245,179,1,0.1)" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between p-5 text-left gap-4"
                >
                  <span className="text-white font-semibold text-sm leading-relaxed">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className="text-yellow-400 shrink-0 mt-0.5 transition-transform duration-300"
                    style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t" style={{ borderColor: "rgba(245,179,1,0.1)" }}>
                        <p className="pt-4">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
