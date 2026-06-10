"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartHandshake, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { submitPartner } from "@/lib/sheets";

const schema = z.object({
  fullName: z.string().min(3, "Full name required"),
  organization: z.string().optional(),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
  category: z.string().min(1, "Category required"),
  specifyCategory: z.string().optional(),
  description: z.string().min(10, "Please describe your partnership"),
  amount: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const categories = ["Financial Support", "Music Equipment", "Music Performance Support", "Other"];

export default function PartnershipSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const category = watch("category");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await submitPartner({
        fullName: data.fullName,
        organization: data.organization || "",
        phone: data.phone,
        email: data.email,
        category: data.category === "Other" ? data.specifyCategory || "Other" : data.category,
        description: data.description,
        amount: data.amount,
        message: data.message,
      });
      if (result.success) {
        setSubmitted(true);
        toast.success("Partnership request submitted! We will contact you soon.");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="partnership" className="py-24 relative overflow-hidden" style={{ background: "#0B0F1A" }}>
      {/* Gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(245,179,1,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-badge inline-flex mb-4"
          >
            🤝 Partnership
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mt-4"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Become A{" "}
            <span style={{ background: "linear-gradient(135deg, #F5B301, #FFE7A0, #D89A00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Partner
            </span>
          </motion.h2>
          <p className="text-white/50 mt-3">
            Join us in making Voice Of Valour Season 4 a transformative event for thousands.
          </p>
        </div>

        {/* Partner categories info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {categories.map((cat) => (
            <div
              key={cat}
              className="glass-card p-3 text-center text-xs text-white/60 hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
            >
              {cat}
            </div>
          ))}
        </div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-10 text-center"
            style={{ borderColor: "rgba(245,179,1,0.4)" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, #F5B301, #D89A00)" }}
            >
              <HeartHandshake size={36} className="text-black" />
            </div>
            <h3 className="text-white text-2xl font-black mb-3" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
              Thank You, Partner!
            </h3>
            <p className="text-white/60">
              Your partnership request has been received. Our team will contact you within 48 hours to discuss the details.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8"
            style={{ borderColor: "rgba(245,179,1,0.2)" }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Full Name *</label>
                  <input {...register("fullName")} placeholder="Your full name" className="form-input" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Organization</label>
                  <input {...register("organization")} placeholder="Organization (optional)" className="form-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Phone *</label>
                  <input {...register("phone")} placeholder="+254 7XX XXX XXX" className="form-input" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Email *</label>
                  <input {...register("email")} type="email" placeholder="email@example.com" className="form-input" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Partnership Category *</label>
                <select {...register("category")} className="form-input">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
              </div>

              {category === "Other" && (
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Specify Partnership *</label>
                  <input {...register("specifyCategory")} placeholder="Describe your partnership type" className="form-input" />
                </div>
              )}

              {category === "Financial Support" && (
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Financial Amount (KES)</label>
                  <input {...register("amount")} placeholder="e.g. 50000" className="form-input" type="number" />
                </div>
              )}

              <div>
                <label className="text-white/60 text-sm mb-1 block">Description *</label>
                <textarea
                  {...register("description")}
                  placeholder="Describe how you would like to partner with us..."
                  rows={3}
                  className="form-input resize-none"
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Message (Optional)</label>
                <textarea
                  {...register("message")}
                  placeholder="Any additional message..."
                  rows={2}
                  className="form-input resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-black text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #F5B301, #D89A00)", boxShadow: "0 4px 20px rgba(245,179,1,0.3)" }}
              >
                {loading ? "Submitting..." : "Submit Partnership Request"}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
}
