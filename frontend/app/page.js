"use client";
import { useState } from "react";
import Link from "next/link";

const LOCATIONS = [
  { id: "maingate",   label: "Main Gate",       icon: "🚪" },
  { id: "parking",    label: "Parking",          icon: "🅿️" },
  { id: "canteen",    label: "Canteen",          icon: "🍽️" },
  { id: "auditorium", label: "Auditorium",       icon: "🎭" },
  { id: "admission",  label: "Admission Block",  icon: "📋" },
  { id: "digital",    label: "Digital Block",    icon: "📡" },
  { id: "chemical",   label: "Chemical Block",   icon: "⚗️" },
  { id: "cyber",      label: "Cyber Block",      icon: "💻" },
  { id: "hitech",     label: "Hitech Block",     icon: "🔬" },
  { id: "sjb",        label: "SJB Block",        icon: "🏛️" },
];

const QUICK_LINKS = [
  { href: "/map",       icon: "🗺️", label: "Campus Map",    desc: "Navigate between buildings" },
  { href: "/search",    icon: "🔍", label: "Search",         desc: "Find any location fast" },
  { href: "/events",    icon: "📅", label: "Events",         desc: "Upcoming campus events" },
  { href: "/emergency", icon: "🚨", label: "Emergency",      desc: "Quick emergency contacts" },
];

export default function Home() {
  const [src,  setSrc]  = useState("");
  const [dest, setDest] = useState("");

  const selectStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    cursor: "pointer",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080c14" }}>

      {/* Hero */}
      <div className="text-center px-4 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
          style={{ backgroundColor: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.2)" }}>
          🎓 Campus Navigation System
        </div>
        <h1 className="text-4xl font-black text-white mb-3 leading-tight">
          Navigate Your Campus<br/>
          <span style={{ color: "#22d3ee" }}>with Confidence</span>
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
          Find the shortest path between any two locations, explore events, scan QR codes and access emergency contacts.
        </p>
      </div>

      {/* Quick route planner */}
      <div className="max-w-lg mx-auto px-4 mb-10">
        <div className="rounded-2xl p-6"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#22d3ee" }}>
            Quick Route Planner
          </p>
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#22d3ee,#818cf8)", color: "#080c14" }}>A</span>
                Starting Point
              </label>
              <select value={src} onChange={e => setSrc(e.target.value)} style={selectStyle}>
                <option value="" style={{ background: "#0b1a0b" }}>Select starting point</option>
                {LOCATIONS.map(l => (
                  <option key={l.id} value={l.id} style={{ background: "#0b1a0b" }}>
                    {l.icon} {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                  style={{ backgroundColor: "#f472b6", color: "#080c14" }}>B</span>
                Destination
              </label>
              <select value={dest} onChange={e => setDest(e.target.value)} style={selectStyle}>
                <option value="" style={{ background: "#0b1a0b" }}>Select destination</option>
                {LOCATIONS.map(l => (
                  <option key={l.id} value={l.id} style={{ background: "#0b1a0b" }}>
                    {l.icon} {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Link
            href={src && dest ? `/map?from=${src}&to=${dest}` : "/map"}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg,#22d3ee,#818cf8)", color: "#080c14" }}>
            🗺️ Open on Map
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          Explore
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map(({ href, icon, label, desc }) => (
            <Link key={href} href={href}
              className="rounded-xl p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All locations grid */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          All Campus Locations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {LOCATIONS.map(loc => (
            <Link key={loc.id} href={`/map?to=${loc.id}`}
              className="rounded-xl p-3 flex items-center gap-2.5 transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
              <span className="text-lg">{loc.icon}</span>
              <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>{loc.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
