"use client";

import { useEffect, useState, useMemo } from "react";
import { getPartners } from "@/lib/sheets";
import { Partner } from "@/types";
import { formatDate } from "@/lib/utils";
import * as XLSX from "xlsx";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    getPartners().then((data) => { setPartners(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.fullName.toLowerCase().includes(q) || (p.organization||"").toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
      const matchCat = !filterCategory || p.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [partners, search, filterCategory]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const categories = [...new Set(partners.map((p) => p.category))].sort();

  const categoryColors: Record<string, string> = {
    "Financial Support": "#10B981",
    "Music Equipment": "#3B82F6",
    "Music Performance Support": "#8B5CF6",
    "Other": "#F59E0B",
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Partners");
    XLSX.writeFile(wb, "partners.xlsx");
  };

  const exportCSV = () => {
    const headers = ["ID","Timestamp","Full Name","Organization","Phone","Email","Category","Description","Amount","Message"];
    const rows = filtered.map((p) => [p.id,p.timestamp,p.fullName,p.organization||"",p.phone,p.email,p.category,p.description,p.amount||"",p.message||""]);
    const csv = [headers,...rows].map((r)=>r.map((c)=>`"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = "partners.csv"; el.click();
  };

  const s = {
    page: { padding: "24px", minHeight: "100vh", background: "#0b0f1a" } as React.CSSProperties,
    title: { color: "#ffffff", fontSize: "22px", fontWeight: 900, fontFamily: "Cinzel,Georgia,serif", margin: "0 0 4px 0" } as React.CSSProperties,
    sub: { color: "#9ca3af", fontSize: "13px", margin: 0 } as React.CSSProperties,
    filterRow: { display: "flex", flexWrap: "wrap" as const, gap: "10px", margin: "20px 0" },
    input: { background: "#1c2333", border: "1px solid #374151", color: "#ffffff", borderRadius: "8px", padding: "9px 14px 9px 36px", fontSize: "13px", outline: "none", flex: 1, minWidth: "180px" } as React.CSSProperties,
    select: { background: "#1c2333", border: "1px solid #374151", color: "#ffffff", borderRadius: "8px", padding: "9px 14px", fontSize: "13px", outline: "none", minWidth: "180px" } as React.CSSProperties,
    btnGold: { display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, color: "#000", background: "linear-gradient(135deg,#F5B301,#D89A00)", border: "none", cursor: "pointer" } as React.CSSProperties,
    btnGhost: { display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#d1d5db", background: "transparent", border: "1px solid #374151", cursor: "pointer" } as React.CSSProperties,
    tableWrap: { borderRadius: "12px", overflow: "hidden", border: "1px solid #1f2937" } as React.CSSProperties,
    th: { textAlign: "left" as const, padding: "12px 16px", color: "#F5B301", fontWeight: 700, fontSize: "11px", textTransform: "uppercase" as const, letterSpacing: "0.07em", borderBottom: "1px solid #1f2937", whiteSpace: "nowrap" as const, background: "#0d1117" },
    tdName: { padding: "13px 16px", color: "#ffffff", fontWeight: 600, whiteSpace: "nowrap" as const },
    td: { padding: "13px 16px", color: "#d1d5db", whiteSpace: "nowrap" as const },
    tdSmall: { padding: "13px 16px", color: "#9ca3af", fontSize: "12px", whiteSpace: "nowrap" as const },
    empty: { textAlign: "center" as const, padding: "48px", color: "#6b7280", background: "#0f1623" },
    pageRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #1f2937", background: "#0d1117" } as React.CSSProperties,
    pageInfo: { color: "#6b7280", fontSize: "12px", margin: 0 } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Partners</h1>
      <p style={s.sub}>{filtered.length} partners registered</p>

      <div style={s.filterRow}>
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, org, email..." style={s.input} />
        </div>
        <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }} style={s.select}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={exportExcel} style={s.btnGold}>⬇ Excel</button>
        <button onClick={exportCSV} style={s.btnGhost}>📄 CSV</button>
      </div>

      <div style={s.tableWrap}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name","Organization","Category","Phone","Amount (KES)","Date"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={s.empty}>Loading partners...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} style={s.empty}>No partners found</td></tr>
              ) : paginated.map((p, i) => {
                const color = categoryColors[p.category] || "#F59E0B";
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? "#0f1623" : "#111827", borderBottom: "1px solid #1a2235" }}>
                    <td style={s.tdName}>{p.fullName}</td>
                    <td style={s.td}>{p.organization || "—"}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44`, whiteSpace: "nowrap" as const }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={s.td}>{p.phone}</td>
                    <td style={{ padding: "13px 16px", color: "#ffffff", fontWeight: 600 }}>
                      {p.amount ? `KES ${parseInt(p.amount).toLocaleString()}` : "—"}
                    </td>
                    <td style={s.tdSmall}>{formatDate(p.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={s.pageRow}>
            <p style={s.pageInfo}>Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</p>
            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: Math.min(totalPages,5) },(_,i)=>i+1).map((p)=>(
                <button key={p} onClick={()=>setPage(p)} style={{ width:"28px",height:"28px",borderRadius:"6px",fontSize:"12px",fontWeight:600,border:"none",cursor:"pointer",background:p===page?"linear-gradient(135deg,#F5B301,#D89A00)":"#1c2333",color:p===page?"#000":"#9ca3af" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
