"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/sheets";
import { Analytics } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from "recharts";

const COLORS = ["#F5B301","#D89A00","#FFE7A0","#B8860B","#DAA520","#FFC200"];
const card = { background: "#0f1623", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px" };
const title = { color: "#ffffff", fontWeight: 700, fontSize: "14px", margin: "0 0 16px 0" };
const tooltip = { background: "#0d1117", border: "1px solid rgba(245,179,1,0.2)", borderRadius: "8px", color: "#fff" };
const tick = { fill: "#9ca3af", fontSize: 11 };

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => { getAnalytics().then(setAnalytics); }, []);

  if (!analytics) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#9ca3af", background: "#0b0f1a" }}>
      Loading analytics...
    </div>
  );

  const combined = analytics.registrationsPerDay.map((r, i) => ({
    date: r.date,
    registrations: r.count,
    partners: analytics.partnersPerDay[i]?.count || 0,
  }));

  return (
    <div style={{ padding: "24px", background: "#0b0f1a", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 900, fontFamily: "Cinzel,Georgia,serif", margin: "0 0 4px 0" }}>Analytics</h1>
        <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>Detailed registration insights</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "16px" }}>
        {/* Bar chart */}
        <div style={card}>
          <p style={title}>Registrations Per Day</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.registrationsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="date" tick={tick} axisLine={false} tickLine={false}/>
              <YAxis tick={tick} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltip}/>
              <Bar dataKey="count" fill="#F5B301" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={card}>
          <p style={title}>Position Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={analytics.positionDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                {analytics.positionDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip contentStyle={tooltip}/>
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
            {analytics.positionDistribution.slice(0,6).map((item, i) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }}/>
                <span style={{ color: "#9ca3af", fontSize: "11px" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partners line */}
        <div style={card}>
          <p style={title}>Partners Over Time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.partnersPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="date" tick={tick} axisLine={false} tickLine={false}/>
              <YAxis tick={tick} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ ...tooltip, border: "1px solid rgba(16,185,129,0.2)" }}/>
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Church horizontal bar */}
        <div style={card}>
          <p style={title}>Church Representation</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.churchRepresentation} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis type="number" tick={tick} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={tick} axisLine={false} tickLine={false} width={70}/>
              <Tooltip contentStyle={tooltip}/>
              <Bar dataKey="value" fill="#F5B301" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Combined area */}
      <div style={card}>
        <p style={title}>Registrations vs Partners Growth</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={combined}>
            <defs>
              <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F5B301" stopOpacity={0.3}/><stop offset="95%" stopColor="#F5B301" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="date" tick={tick} axisLine={false} tickLine={false}/>
            <YAxis tick={tick} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={tooltip}/>
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }}/>
            <Area type="monotone" dataKey="registrations" stroke="#F5B301" fill="url(#ag1)" strokeWidth={2} name="Registrations"/>
            <Area type="monotone" dataKey="partners" stroke="#10B981" fill="url(#ag2)" strokeWidth={2} name="Partners"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
