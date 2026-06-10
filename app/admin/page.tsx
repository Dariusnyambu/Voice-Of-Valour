"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/sheets";
import { Analytics } from "@/types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const icons = {
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5B301" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5B301" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  church: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5B301" strokeWidth="2"><path d="M18 22H6a2 2 0 0 1-2-2V11l8-8 8 8v9a2 2 0 0 1-2 2z"/><path d="M9 22V12h6v10"/></svg>,
  trending: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5B301" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

function KPICard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div style={{ background: "#0f1623", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px" }}>
      <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(245,179,1,0.1)", border: "1px solid rgba(245,179,1,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
        {icon}
      </div>
      <p style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, fontFamily: "Cinzel,Georgia,serif", margin: "0 0 4px 0" }}>{value}</p>
      <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => { getAnalytics().then(setAnalytics); }, []);

  if (!analytics) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#9ca3af", background: "#0b0f1a" }}>
      Loading dashboard...
    </div>
  );

  const tooltipStyle = { background: "#0d1117", border: "1px solid rgba(245,179,1,0.2)", borderRadius: "8px", color: "#fff" };

  return (
    <div style={{ padding: "24px", background: "#0b0f1a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 900, fontFamily: "Cinzel,Georgia,serif", margin: "0 0 4px 0" }}>Dashboard Overview</h1>
        <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>Voice Of Valour Season 4 — Live statistics</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <KPICard icon={icons.users}   label="Total Registrations"   value={analytics.totalAttendees.toLocaleString()} />
        <KPICard icon={icons.heart}   label="Total Partners"         value={analytics.totalPartners} />
        <KPICard icon={icons.church}  label="Churches Represented"   value={analytics.churchesRepresented} />
        <KPICard icon={icons.trending} label="Today's Registrations" value={analytics.todayRegistrations} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {/* Registrations chart */}
        <div style={{ background: "#0f1623", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px" }}>
          <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", margin: "0 0 16px 0" }}>Registrations Over Time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics.registrationsPerDay}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5B301" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F5B301" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Area type="monotone" dataKey="count" stroke="#F5B301" fill="url(#g1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Partners chart */}
        <div style={{ background: "#0f1623", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px" }}>
          <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", margin: "0 0 16px 0" }}>Partners Over Time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics.partnersPerDay}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ ...tooltipStyle, border: "1px solid rgba(16,185,129,0.2)" }}/>
              <Area type="monotone" dataKey="count" stroke="#10B981" fill="url(#g2)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Position Distribution */}
      <div style={{ background: "#0f1623", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px" }}>
        <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", margin: "0 0 16px 0" }}>Position Distribution</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {analytics.positionDistribution.slice(0, 7).map((item) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "#9ca3af", fontSize: "13px", width: "120px", flexShrink: 0 }}>{item.name}</span>
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "#1c2333", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "4px", background: "linear-gradient(90deg,#F5B301,#D89A00)", width: `${(item.value / analytics.totalAttendees) * 100}%`, transition: "width 1s ease" }} />
              </div>
              <span style={{ color: "#F5B301", fontSize: "13px", fontWeight: 700, width: "30px", textAlign: "right" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
