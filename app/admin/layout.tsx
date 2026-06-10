"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Attendees", href: "/admin/attendees" },
  { icon: HeartHandshake, label: "Partners", href: "/admin/partners" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0b0f1a", color: "#ffffff" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#06090f",
          borderRight: "1px solid rgba(245,179,1,0.1)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
        className="lg-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(245,179,1,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(245,179,1,0.3)" }}>
              <img src="/logo.png" alt="VOV" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ color: "#ffffff", fontWeight: 900, fontSize: "11px", fontFamily: "Cinzel, Georgia, serif", margin: 0 }}>VOV S4</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: 0 }}>Admin Dashboard</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", display: "block" }} className="lg-hide">
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: active ? "1px solid rgba(245,179,1,0.25)" : "1px solid transparent",
                  background: active ? "rgba(245,179,1,0.12)" : "transparent",
                  color: active ? "#F5B301" : "rgba(255,255,255,0.55)",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px", borderTop: "1px solid rgba(245,179,1,0.08)" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "none", background: "transparent", color: "rgba(239,68,68,0.7)" }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 0, minWidth: 0 }} className="admin-main">
        {/* Topbar */}
        <header style={{ height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "#06090f", borderBottom: "1px solid rgba(245,179,1,0.08)", position: "sticky", top: 0, zIndex: 30 }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer" }}
          >
            <Menu size={20} />
          </button>
          <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, fontFamily: "Cinzel, Georgia, serif", margin: 0 }}>
            Voice Of Valour Season 4
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>
              <Bell size={18} />
            </button>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #F5B301, #D89A00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontWeight: 700, fontSize: "13px" }}>A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", background: "#0b0f1a", color: "#ffffff" }}>
          {children}
        </main>
      </div>

      {/* Inline styles for responsive sidebar */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar {
            transform: translateX(0) !important;
            position: relative !important;
          }
          .lg-hide { display: none !important; }
          .admin-main { margin-left: 0 !important; }
        }
        * { box-sizing: border-box; }

        /* Force ALL text in admin to be visible — override Tailwind v4 opacity issues */
        .admin-main td,
        .admin-main th,
        .admin-main p,
        .admin-main span,
        .admin-main h1,
        .admin-main h2,
        .admin-main h3,
        .admin-main label,
        .admin-main input,
        .admin-main select {
          -webkit-text-fill-color: unset !important;
          color: inherit;
        }
        .admin-main table td { color: #d1d5db !important; }
        .admin-main table td:first-child { color: #ffffff !important; }
        .admin-main table th { color: #F5B301 !important; }
      `}</style>
    </div>
  );
}
