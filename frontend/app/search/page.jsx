"use client";
import { useState, useEffect, useRef } from "react";

const categoryColors = {
  Academic:       { badge: "rgba(34,211,238,0.12)",  text: "#22d3ee",  border: "rgba(34,211,238,0.25)"  },
  Administrative: { badge: "rgba(167,139,250,0.12)", text: "#a78bfa",  border: "rgba(167,139,250,0.25)" },
  Facility:       { badge: "rgba(52,211,153,0.12)",  text: "#34d399",  border: "rgba(52,211,153,0.25)"  },
};
const categoryIcons = { Academic:"🎓", Administrative:"🏢", Facility:"🏗️" };

function LocationCard({ location }) {
  const colors = categoryColors[location.category] || {
    badge:"rgba(255,255,255,0.07)", text:"rgba(255,255,255,0.5)", border:"rgba(255,255,255,0.1)"
  };
  return (
    <div className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
      style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(34,211,238,0.2)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{location.name}</h3>
          <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mt-1.5"
            style={{ backgroundColor:colors.badge, color:colors.text, border:`1px solid ${colors.border}` }}>
            {categoryIcons[location.category]} {location.category}
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor:"rgba(34,211,238,0.08)" }}>
          {location.icon || "🏫"}
        </div>
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.5)" }}>
        {location.description}
      </p>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide mb-2" style={{ color:"rgba(255,255,255,0.3)" }}>Facilities</p>
        <div className="flex flex-wrap gap-1">
          {location.facilities.map(f=>(
            <span key={f} className="text-xs px-2 py-0.5 rounded-md"
              style={{ backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.45)", border:"1px solid rgba(255,255,255,0.08)" }}>
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1" style={{ color:"rgba(255,255,255,0.35)" }}>
          🏢 {location.floor}
        </span>
        <a href={`/map?to=${location.id}`}
          className="font-medium flex items-center gap-1 transition-colors"
          style={{ color:"#22d3ee" }}>
          View on Map →
        </a>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery]               = useState("");
  const [results, setResults]           = useState([]);
  const [loading, setLoading]           = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories]     = useState(["All"]);
  const debounceRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(()=>{
    fetch(`${API_URL}/api/search`).then(r=>r.json()).then(d=>setResults(d.results)).catch(console.error);
    fetch(`${API_URL}/api/search/categories`).then(r=>r.json()).then(d=>setCategories(["All",...d.categories])).catch(console.error);
  },[]);

  useEffect(()=>{
    clearTimeout(debounceRef.current);
    debounceRef.current=setTimeout(()=>performSearch(query,activeCategory),300);
  },[query,activeCategory]);

  function performSearch(q,category){
    setLoading(true);
    const url=new URL(`${API_URL}/api/search`);
    if(q) url.searchParams.set("q",q);
    fetch(url.toString()).then(r=>r.json()).then(data=>{
      let filtered=data.results;
      if(category!=="All") filtered=filtered.filter(l=>l.category===category);
      setResults(filtered);
    }).catch(console.error).finally(()=>setLoading(false));
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor:"#080c14" }}>
      {/* Header */}
      <div className="sticky top-0 z-10"
        style={{ backgroundColor:"rgba(8,12,20,0.94)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-black"
              style={{ backgroundColor:"#22d3ee" }}>🔍</div>
            <div>
              <h1 className="text-lg font-bold text-white">Search Campus</h1>
              <p className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Find buildings, labs, and facilities</p>
            </div>
          </div>
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:"rgba(255,255,255,0.35)" }}>🔍</span>
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="Search locations, facilities..."
              className="w-full text-sm outline-none transition-all"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"white", borderRadius:"12px", padding:"10px 14px 10px 44px" }}
              onFocus={e=>e.target.style.borderColor="rgba(34,211,238,0.5)"}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
            {query&&(
              <button onClick={()=>setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color:"rgba(255,255,255,0.35)" }}>✕</button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat=>(
              <button key={cat} onClick={()=>setActiveCategory(cat)}
                className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={activeCategory===cat
                  ?{backgroundColor:"#22d3ee",color:"#080c14"}
                  :{backgroundColor:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.08)"}}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-sm mb-4" style={{ color:"rgba(255,255,255,0.35)" }}>
          {loading?"Searching…":<><span className="text-white font-medium">{results.length}</span>{" "}
            {results.length===1?"location":"locations"} found
            {query&&<> for "<span style={{color:"#22d3ee"}}>{query}</span>"</>}</>}
        </p>
        {loading?(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i=>(
              <div key={i} className="rounded-2xl h-52 animate-pulse"
                style={{backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}/>
            ))}
          </div>
        ):results.length>0?(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(loc=><LocationCard key={loc.id} location={loc}/>)}
          </div>
        ):(
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏫</div>
            <p className="text-lg font-medium text-white mb-1">No locations found</p>
            <p className="text-sm" style={{color:"rgba(255,255,255,0.4)"}}>Try a different search term or clear the filter</p>
            <button onClick={()=>{setQuery("");setActiveCategory("All");}}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-black"
              style={{backgroundColor:"#22d3ee"}}>Clear Search</button>
          </div>
        )}
      </div>
    </div>
  );
}
