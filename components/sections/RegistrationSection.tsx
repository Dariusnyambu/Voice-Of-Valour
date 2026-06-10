"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, Mail, Building2, MapPinned, Briefcase, CheckCircle, ArrowRight, ArrowLeft, AlertCircle, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { submitAttendee, checkDuplicate } from "@/lib/sheets";

const schema = z.object({
  fullName: z.string().min(3, "Full name required"),
  phone: z.string().min(9, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  gender: z.string().optional(),
  county: z.string().optional(),
  town: z.string().optional(),
  churchName: z.string().min(1, "Church name required"),
  churchOther: z.string().optional(),
  churchLocation: z.string().optional(),
  position: z.string().optional(),
  attendanceType: z.string().min(1, "Attendance type required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Member {
  name: string;
}

const positions = [
  "Pastor","Associate Pastor","Elder","Deacon","Praise Team",
  "Worship Leader","Choir Member","Usher","Youth Leader","Church Member","Other",
];

const churches = [
  "FGCK Christ Centre","FGCK (Other)","CITAM","PCEA",
  "Deliverance Church","AIC (Africa Inland Church)","Kingdom Seekers","Other (Specify)",
];

const kenyanCounties = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Kiambu","Machakos","Kajiado",
  "Muranga","Nyandarua","Nyeri","Kirinyaga","Embu","Meru","Tharaka-Nithi",
  "Isiolo","Marsabit","Garissa","Wajir","Mandera","Samburu","Turkana",
  "West Pokot","Trans Nzoia","Uasin Gishu","Elgeyo-Marakwet","Nandi",
  "Baringo","Laikipia","Narok","Kericho","Bomet","Kakamega","Vihiga",
  "Bungoma","Busia","Siaya","Homa Bay","Migori","Kisii","Nyamira","Other",
];

const steps = [
  { title: "Personal Info", fields: ["fullName","phone","email","gender"] },
  { title: "Location",      fields: ["county","town"] },
  { title: "Church Info",   fields: ["churchName","churchOther","churchLocation","position","attendanceType"] },
  { title: "Confirm",       fields: ["notes"] },
];

// ── Shared styles ────────────────────────────────────────────
const inp: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(245,179,1,0.2)",
  color: "white",
  borderRadius: "8px",
  padding: "11px 14px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
};
const sel: React.CSSProperties = { ...inp, background: "#1a2035", cursor: "pointer" };
const lbl: React.CSSProperties = {
  color: "rgba(255,255,255,0.6)",
  fontSize: "13px",
  marginBottom: "6px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};
const err: React.CSSProperties = { color: "#f87171", fontSize: "12px", marginTop: "4px" };

export default function RegistrationSection() {
  const [step, setStep]           = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [checking, setChecking]   = useState(false);
  const [dupError, setDupError]   = useState("");
  const [members, setMembers]     = useState<Member[]>([{ name: "" }]);

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const formData       = watch();
  const attendanceType = watch("attendanceType");
  const selectedChurch = watch("churchName");
  const isGroup        = attendanceType === "Group" || attendanceType === "Family";

  // ── Member list helpers ──────────────────────────────────
  const addMember = () => setMembers((m) => [...m, { name: "" }]);

  const removeMember = (i: number) =>
    setMembers((m) => m.filter((_, idx) => idx !== i));

  const updateMember = (i: number, value: string) =>
    setMembers((m) => m.map((mem, idx) => idx === i ? { name: value } : mem));

  // ── Step navigation ──────────────────────────────────────
  const nextStep = async () => {
    const fields = steps[step].fields as Array<keyof FormData>;
    const valid  = await trigger(fields);
    if (!valid) return;

    if (step === 0) {
      setChecking(true);
      setDupError("");
      const result = await checkDuplicate(formData.phone || "", formData.email || "");
      setChecking(false);
      if (result.isDuplicate) {
        setDupError(result.message || "You are already registered!");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  // ── Submit ───────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setDupError("");
    try {
      const churchName = data.churchName === "Other (Specify)"
        ? (data.churchOther || "Other")
        : data.churchName;

      // Build member names string for notes
      const filledMembers = members.filter((m) => m.name.trim());
      const memberNotes   = filledMembers.length > 0
        ? `${isGroup ? (attendanceType + " members") : "Members"}: ${filledMembers.map((m) => m.name).join(", ")}`
        : "";

      const notes = [data.notes, memberNotes].filter(Boolean).join(" | ");

      const result = await submitAttendee({ ...data, churchName, notes });

      if (result.isDuplicate) {
        setDupError("This phone number or email is already registered!");
        setStep(0);
        toast.error("Already registered with this phone or email.");
      } else if (result.success) {
        setSubmitted(true);
        toast.success("Registration successful! See you July 3rd! 🙌");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────
  if (submitted) {
    return (
      <section id="register" className="py-24 relative" style={{ background: "#111827" }}>
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-10 text-center" style={{ borderColor: "rgba(245,179,1,0.4)" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg,#F5B301,#D89A00)" }}>
              <CheckCircle size={36} className="text-black" />
            </div>
            <h3 className="text-white text-2xl font-black mb-3" style={{ fontFamily: "'Cinzel',Georgia,serif" }}>
              You&apos;re Registered!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>
              See you on <span style={{ color: "#F5B301", fontWeight: 600 }}>3 July 2026</span> at FGCK Christ Centre, Kasarani. 9 PM — Till Dawn.
            </p>
            <div className="glass-card p-4 text-left" style={{ borderColor: "rgba(245,179,1,0.2)" }}>
              <p style={{ color: "#F5B301", fontSize: "12px", fontWeight: 600, marginBottom: "8px", letterSpacing: "2px" }}>WHAT TO CARRY</p>
              <ul style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.9 }}>
                <li>• Your Bible</li>
                <li>• A worship heart</li>
                <li>• Something warm (it goes till dawn)</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 relative" style={{ background: "#111827" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(245,179,1,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(245,179,1,0.025) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="max-w-2xl mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="section-badge inline-flex mb-4">📋 Register
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mt-4"
            style={{ fontFamily: "'Cinzel',Georgia,serif" }}>
            Secure Your{" "}
            <span style={{ background: "linear-gradient(135deg,#F5B301,#FFE7A0,#D89A00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Spot
            </span>
          </motion.h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "10px", fontSize: "14px" }}>
            Free registration — Name, Phone &amp; Email required
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card p-6 md:p-8" style={{ borderColor: "rgba(245,179,1,0.2)" }}>

          {/* Progress */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
            {steps.map((s, i) => (
              <div key={s.title} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 700, transition: "all 0.3s",
                  background: i <= step ? "linear-gradient(135deg,#F5B301,#D89A00)" : "rgba(255,255,255,0.08)",
                  color: i <= step ? "#000" : "rgba(255,255,255,0.3)",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>{s.title}</span>
              </div>
            ))}
          </div>

          {/* Duplicate error */}
          {dupError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 14px", marginBottom: "18px", display: "flex", gap: "10px" }}>
              <AlertCircle size={16} style={{ color: "#f87171", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <p style={{ color: "#f87171", fontWeight: 700, fontSize: "13px", margin: "0 0 2px 0" }}>Already Registered</p>
                <p style={{ color: "rgba(248,113,113,0.8)", fontSize: "13px", margin: 0 }}>{dupError}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Personal ── */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <p style={{ color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}>Personal Information</p>
                  <div>
                    <label style={lbl}><User size={12} /> Full Name *</label>
                    <input {...register("fullName")} placeholder="e.g. John Kamau" style={inp} />
                    {errors.fullName && <p style={err}>{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label style={lbl}><Phone size={12} /> Phone Number *</label>
                    <input {...register("phone")} placeholder="+254 7XX XXX XXX" style={inp} />
                    {errors.phone && <p style={err}>{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label style={lbl}><Mail size={12} /> Email Address *</label>
                    <input {...register("email")} type="email" placeholder="your@email.com" style={inp} />
                    {errors.email && <p style={err}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Gender (optional)</label>
                    <select {...register("gender")} style={sel}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Location ── */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <p style={{ color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}>Your Location (optional)</p>
                  <div>
                    <label style={lbl}><MapPinned size={12} /> County</label>
                    <select {...register("county")} style={sel}>
                      <option value="">Select county</option>
                      {kenyanCounties.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}><MapPinned size={12} /> Town / City</label>
                    <input {...register("town")} placeholder="e.g. Nairobi" style={inp} />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Church + Attendance ── */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <p style={{ color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}>Church &amp; Attendance</p>

                  <div>
                    <label style={lbl}><Building2 size={12} /> Church Name *</label>
                    <select {...register("churchName")} style={sel}>
                      <option value="">Select your church</option>
                      {churches.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.churchName && <p style={err}>{errors.churchName.message}</p>}
                  </div>

                  {selectedChurch === "Other (Specify)" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label style={lbl}><Building2 size={12} /> Specify Church *</label>
                      <input {...register("churchOther")} placeholder="Enter your church name" style={inp} />
                    </motion.div>
                  )}

                  <div>
                    <label style={lbl}><MapPinned size={12} /> Church Location (optional)</label>
                    <input {...register("churchLocation")} placeholder="e.g. Westlands, Nairobi" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}><Briefcase size={12} /> Position In Church (optional)</label>
                    <select {...register("position")} style={sel}>
                      <option value="">Select position</option>
                      {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Attendance Type */}
                  <div>
                    <label style={{ ...lbl, marginBottom: "10px" }}>Attendance Type *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      {[
                        { type: "Individual", icon: "👤", desc: "Just me" },
                        { type: "Group",      icon: "👥", desc: "Church group" },
                        { type: "Family",     icon: "👨‍👩‍👧‍👦", desc: "My family" },
                      ].map(({ type, icon, desc }) => (
                        <label key={type} style={{ cursor: "pointer" }}>
                          <input {...register("attendanceType")} type="radio" value={type} style={{ display: "none" }} />
                          <div style={{
                            textAlign: "center", padding: "12px 8px", borderRadius: "10px",
                            fontSize: "12px", fontWeight: 600, transition: "all 0.2s", cursor: "pointer",
                            background: attendanceType === type ? "rgba(245,179,1,0.15)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${attendanceType === type ? "#F5B301" : "rgba(255,255,255,0.1)"}`,
                            color: attendanceType === type ? "#F5B301" : "rgba(255,255,255,0.5)",
                          }}>
                            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{icon}</div>
                            <div>{type}</div>
                            <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "2px" }}>{desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.attendanceType && <p style={err}>{errors.attendanceType.message}</p>}
                  </div>

                  {/* ── Member Names (Group / Family only) ── */}
                  <AnimatePresence>
                    {isGroup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{
                          background: "rgba(245,179,1,0.06)",
                          border: "1px solid rgba(245,179,1,0.2)",
                          borderRadius: "12px",
                          padding: "16px",
                          marginTop: "4px",
                        }}>
                          {/* Header */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Users size={15} style={{ color: "#F5B301" }} />
                              <span style={{ color: "#F5B301", fontWeight: 700, fontSize: "13px" }}>
                                {attendanceType === "Family" ? "Family Members" : "Group Members"}
                              </span>
                            </div>
                            <span style={{
                              background: "rgba(245,179,1,0.15)", color: "#F5B301",
                              fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "100px",
                            }}>
                              {members.filter(m => m.name.trim()).length} added
                            </span>
                          </div>

                          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "12px" }}>
                            {attendanceType === "Family"
                              ? "Add the names of family members attending (e.g. spouse, children, house manager)"
                              : "Add the names of group members attending"}
                          </p>

                          {/* Member inputs */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {members.map((member, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ display: "flex", gap: "8px", alignItems: "center" }}
                              >
                                <div style={{
                                  width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                                  background: "rgba(245,179,1,0.15)", border: "1px solid rgba(245,179,1,0.3)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: "#F5B301", fontSize: "11px", fontWeight: 700,
                                }}>
                                  {i + 1}
                                </div>
                                <input
                                  value={member.name}
                                  onChange={(e) => updateMember(i, e.target.value)}
                                  placeholder={
                                    attendanceType === "Family"
                                      ? i === 0 ? "e.g. Jane Kamau (Spouse)" : i === 1 ? "e.g. Tim Kamau (Son)" : `Member ${i + 1} name`
                                      : `Member ${i + 1} full name`
                                  }
                                  style={{
                                    ...inp,
                                    padding: "9px 12px",
                                    fontSize: "13px",
                                    flex: 1,
                                  }}
                                />
                                {members.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeMember(i)}
                                    style={{
                                      width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                                      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                                      color: "#f87171", cursor: "pointer", display: "flex",
                                      alignItems: "center", justifyContent: "center",
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </motion.div>
                            ))}
                          </div>

                          {/* Add member button */}
                          <button
                            type="button"
                            onClick={addMember}
                            style={{
                              marginTop: "10px", width: "100%", padding: "9px",
                              borderRadius: "8px", border: "1px dashed rgba(245,179,1,0.3)",
                              background: "transparent", color: "rgba(245,179,1,0.7)",
                              fontSize: "13px", fontWeight: 600, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            }}
                          >
                            <Plus size={14} /> Add Another Member
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ── STEP 4: Confirm ── */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <p style={{ color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}>Confirm &amp; Submit</p>

                  {/* Summary */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,179,1,0.15)", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      ["Name",     formData.fullName],
                      ["Phone",    formData.phone],
                      ["Email",    formData.email],
                      ["County",   formData.county || "—"],
                      ["Church",   formData.churchName === "Other (Specify)" ? (formData.churchOther || "Other") : (formData.churchName || "—")],
                      ["Position", formData.position || "—"],
                      ["Type",     formData.attendanceType],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
                        <span style={{ color: "#ffffff", fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}

                    {/* Show group/family members in summary */}
                    {isGroup && members.filter(m => m.name.trim()).length > 0 && (
                      <div style={{ marginTop: "4px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "6px" }}>
                          {attendanceType} Members:
                        </p>
                        {members.filter(m => m.name.trim()).map((m, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(245,179,1,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#F5B301", flexShrink: 0 }}>
                              {i + 1}
                            </div>
                            <span style={{ color: "#ffffff", fontSize: "13px" }}>{m.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={lbl}>Additional Notes (Optional)</label>
                    <textarea {...register("notes")} placeholder="Any special needs or message..." rows={2}
                      style={{ ...inp, resize: "none" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => s - 1)}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button type="button" onClick={nextStep} disabled={checking}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#F5B301,#D89A00)", color: "#000", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", opacity: checking ? 0.7 : 1, boxShadow: "0 4px 20px rgba(245,179,1,0.3)" }}>
                  {checking ? "Checking..." : <><span>Continue</span><ArrowRight size={14} /></>}
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#F5B301,#D89A00)", color: "#000", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 20px rgba(245,179,1,0.3)" }}>
                  {loading ? "Submitting..." : "Complete Registration ✓"}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
