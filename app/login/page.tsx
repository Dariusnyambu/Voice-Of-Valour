"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok && !result?.error) {
        toast.success("Welcome back!");
        router.push(callbackUrl);
        router.refresh();
      } else {
        toast.error("Invalid email or password. Please try again.");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0B0B0B 0%, #111827 50%, #0B0F1A 100%)",
      }}
    >
      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245, 179, 1, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 179, 1, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Gold glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,179,1,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-yellow-400/40"
            style={{ boxShadow: "0 0 40px rgba(245,179,1,0.3)" }}
          >
            <img src="/logo.png" alt="Voice of Valour" className="w-full h-full object-cover" />
          </div>
          <h1
            className="text-white text-2xl font-black"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Admin Portal
          </h1>
          <p className="text-white/40 text-sm mt-1">Voice Of Valour Season 4</p>
        </div>

        <div
          className="glass-card p-8"
          style={{ borderColor: "rgba(245,179,1,0.2)" }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@voiceofvalour.co.ke"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm mb-1.5 block font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-black text-sm transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #F5B301, #D89A00)",
                boxShadow: "0 4px 20px rgba(245,179,1,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-center text-white/20 text-xs">
              Restricted access — authorised personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
