"use client";
import Link from "next/link";

const features = [
  { icon:"🗺️", title:"Interactive Campus Map", description:"Navigate 10 campus locations with real-time pathfinding using Dijkstra's algorithm. Animated dot walks along real pathways." },
  { icon:"🔍", title:"Smart Search",           description:"Find any of the 10 campus buildings and facilities instantly with intelligent keyword filtering and category tabs." },
  { icon:"📅", title:"Events Calendar",        description:"Stay updated with campus events, workshops, and activities with registration and capacity tracking." },
  { icon:"📷", title:"QR Code Scanner",        description:"Scan QR codes placed at all 10 campus locations to instantly get directions, hours and contact info." },
  { icon:"🚨", title:"Emergency Contacts",     description:"Quick access to all emergency contacts, safety tips, and assembly points for campus security." },
  { icon:"🔊", title:"Voice Navigation",       description:"Turn-by-turn voice guidance that announces each direction as the dot moves — synced, never stale." },
];

const techStack = [
  { name:"Next.js 14",          category:"Frontend Framework" },
  { name:"React 18",            category:"UI Library" },
  { name:"Tailwind CSS",        category:"Styling" },
  { name:"Express.js",          category:"Backend Server" },
  { name:"Node.js",             category:"Runtime" },
  { name:"Dijkstra's Algorithm",category:"Pathfinding" },
  { name:"Web Speech API",      category:"Voice Navigation" },
  { name:"SVG + CSS Dashoffset",category:"Path Animation" },
];

const locations = [
  { icon:"🚪", name:"Main Gate" },{ icon:"🅿️", name:"Parking" },
  { icon:"🍽️", name:"Canteen" },  { icon:"🎭", name:"Auditorium" },
  { icon:"📋", name:"Admission Block" },{ icon:"📡", name:"Digital Block" },
  { icon:"⚗️", name:"Chemical Block" },{ icon:"💻", name:"Cyber Block" },
  { icon:"🔬", name:"Hitech Block" },  { icon:"🏛️", name:"SJB Block" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor:"#080c14" }}>

      {/* Header */}
      <div style={{ backgroundColor:"rgba(34,211,238,0.05)", borderBottom:"1px solid rgba(34,211,238,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)" }}>ℹ️</div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color:"#22d3ee" }}>About Campus Nav</h1>
              <p className="text-sm" style={{ color:"rgba(255,255,255,0.4)" }}>Your complete campus navigation solution</p>
            </div>
          </div>
          <Link href="/" className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.08)" }}>
            ← Back
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor:"rgba(34,211,238,0.1)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.2)" }}>
            🎓 10-Location Campus Navigation System
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Navigate Your Campus with Confidence</h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color:"rgba(255,255,255,0.45)" }}>
            Campus Nav is a full-stack navigation platform covering all 10 campus locations —
            from the Main Gate to academic blocks — with real-time pathfinding, voice guidance, and QR scanning.
          </p>
        </div>

        {/* Campus locations */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-center text-white mb-8">📍 10 Campus Locations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {locations.map(loc=>(
              <div key={loc.name} className="rounded-xl p-3 text-center transition-all"
                style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(34,211,238,0.2)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
                <div className="text-2xl mb-1">{loc.icon}</div>
                <p className="text-[11px] font-semibold" style={{ color:"rgba(255,255,255,0.65)" }}>{loc.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-center text-white mb-8">✨ Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f,i)=>(
              <div key={i} className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
                style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(34,211,238,0.2)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{f.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-center text-white mb-8">🛠️ Technology Stack</h3>
          <div className="rounded-2xl p-8" style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStack.map((t,i)=>(
                <div key={i} className="text-center p-4 rounded-xl transition-all"
                  style={{ backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(34,211,238,0.2)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
                  <p className="font-bold text-white mb-1 text-sm">{t.name}</p>
                  <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.4)" }}>{t.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals & Future */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl p-6"
            style={{ backgroundColor:"rgba(34,211,238,0.05)", border:"1px solid rgba(34,211,238,0.15)" }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color:"#22d3ee" }}>🎯 Project Goals</h3>
            <ul className="space-y-3">
              {["Simplify campus navigation with real shortest-path routing","Cover all 10 campus locations including new facilities","Provide voice-guided navigation synced to map movement","Quick access to emergency contacts and safety resources"].map((item,i)=>(
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 shrink-0" style={{ color:"#22d3ee" }}>•</span>
                  <span className="text-sm" style={{ color:"rgba(255,255,255,0.55)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6"
            style={{ backgroundColor:"rgba(167,139,250,0.05)", border:"1px solid rgba(167,139,250,0.15)" }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color:"#a78bfa" }}>🚀 Future Enhancements</h3>
            <ul className="space-y-3">
              {["Real-time GPS tracking and live location updates","Indoor floor-level navigation within blocks","Push notifications for nearby campus events","Mobile app for iOS and Android platforms"].map((item,i)=>(
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 shrink-0" style={{ color:"#a78bfa" }}>•</span>
                  <span className="text-sm" style={{ color:"rgba(255,255,255,0.55)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Developer */}
        <div className="rounded-2xl p-8 text-center mb-10"
          style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-xl font-bold text-white mb-2">👨‍💻 Developer</h3>
          <p className="text-sm mb-6" style={{ color:"rgba(255,255,255,0.4)" }}>Full-stack web development portfolio project</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[{l:"Built with",v:"Next.js & Express"},{l:"Locations",v:"10 buildings"},{l:"Version",v:"2.0.0"}].map(item=>(
              <div key={item.l} className="px-6 py-3 rounded-xl"
                style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs mb-1" style={{ color:"rgba(255,255,255,0.4)" }}>{item.l}</p>
                <p className="font-bold text-white">{item.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex justify-center gap-3">
            <Link href="/" className="px-6 py-3 rounded-xl font-semibold text-sm text-black active:scale-95"
              style={{ backgroundColor:"#22d3ee" }}>🏠 Home</Link>
            <Link href="/map" className="px-6 py-3 rounded-xl font-semibold text-sm active:scale-95"
              style={{ backgroundColor:"rgba(255,255,255,0.07)", color:"white", border:"1px solid rgba(255,255,255,0.1)" }}>🗺️ Try the Map</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
