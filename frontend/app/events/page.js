"use client";
import { useState, useEffect } from "react";

const categoryColors = {
  Technical:      { bg:"rgba(34,211,238,0.1)",  text:"#22d3ee",  border:"rgba(34,211,238,0.2)"  },
  Cultural:       { bg:"rgba(244,114,182,0.1)", text:"#f472b6",  border:"rgba(244,114,182,0.2)" },
  Workshop:       { bg:"rgba(251,146,60,0.1)",  text:"#fb923c",  border:"rgba(251,146,60,0.2)"  },
  Academic:       { bg:"rgba(52,211,153,0.1)",  text:"#34d399",  border:"rgba(52,211,153,0.2)"  },
  Club:           { bg:"rgba(167,139,250,0.1)", text:"#a78bfa",  border:"rgba(167,139,250,0.2)" },
  Administrative: { bg:"rgba(255,255,255,0.06)",text:"rgba(255,255,255,0.5)",border:"rgba(255,255,255,0.1)" },
};

const categoryEmojis = {
  Technical:"💻", Cultural:"🎭", Workshop:"🔧",
  Academic:"📚",  Club:"🤝",     Administrative:"🏛️",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday:"short", day:"numeric", month:"short", year:"numeric",
  });
}

function getCapacityPercent(current, max) {
  return Math.min(100, Math.round((current / max) * 100));
}

function EventCard({ event, featured = false }) {
  const colors = categoryColors[event.category] || categoryColors.Administrative;
  const capacity = getCapacityPercent(event.currentAttendees, event.maxAttendees);
  const isFull   = capacity >= 100;
  const capColor = capacity >= 90 ? "#f87171" : capacity >= 60 ? "#fb923c" : "#22d3ee";

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor:"rgba(255,255,255,0.04)",
        border:`1px solid ${featured?"rgba(34,211,238,0.25)":"rgba(255,255,255,0.08)"}`,
      }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(34,211,238,0.2)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=featured?"rgba(34,211,238,0.25)":"rgba(255,255,255,0.08)"}>

      {/* Top accent bar */}
      <div className="h-1" style={{backgroundColor:colors.text, opacity:0.6}}/>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{backgroundColor:colors.bg, color:colors.text, border:`1px solid ${colors.border}`}}>
                {categoryEmojis[event.category]} {event.category}
              </span>
              {featured && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{backgroundColor:"rgba(251,191,36,0.1)",color:"#fbbf24",border:"1px solid rgba(251,191,36,0.2)"}}>
                  ⭐ Featured
                </span>
              )}
            </div>
            <h3 className="font-bold text-white text-lg leading-tight">{event.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{color:"rgba(255,255,255,0.45)"}}>
          {event.description}
        </p>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm" style={{color:"rgba(255,255,255,0.5)"}}>
          <div className="flex items-center gap-1.5"><span>📅</span><span>{formatDate(event.date)}</span></div>
          <div className="flex items-center gap-1.5"><span>🕐</span><span>{event.time} – {event.endTime}</span></div>
          <div className="flex items-center gap-1.5"><span>📍</span><span>{event.location}</span></div>
          <div className="flex items-center gap-1.5"><span>👤</span><span>{event.organizer}</span></div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1" style={{color:"rgba(255,255,255,0.35)"}}>
            <span>Seats filled</span>
            <span style={isFull?{color:"#f87171"}:{}}>
              {event.currentAttendees}/{event.maxAttendees} ({capacity}%)
            </span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{backgroundColor:"rgba(255,255,255,0.08)"}}>
            <div className="h-1.5 rounded-full transition-all"
              style={{width:`${capacity}%`, backgroundColor:capColor}}/>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.slice(0,3).map(tag=>(
            <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
              style={{backgroundColor:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.35)",border:"1px solid rgba(255,255,255,0.07)"}}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Register button */}
        <button
          disabled={!event.registrationOpen || isFull}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={!event.registrationOpen || isFull
            ?{backgroundColor:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.25)",cursor:"not-allowed"}
            :{backgroundColor:"#22d3ee",color:"#080c14"}}>
          {isFull?"❌ Fully Booked":!event.registrationOpen?"🔒 Registration Closed":"✅ Register Now"}
        </button>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents]           = useState([]);
  const [featured, setFeatured]       = useState([]);
  const [categories, setCategories]   = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(()=>{
    Promise.all([
      fetch(`${API_URL}/api/events`).then(r=>r.json()),
      fetch(`${API_URL}/api/events?featured=true`).then(r=>r.json()),
      fetch(`${API_URL}/api/events/categories/list`).then(r=>r.json()),
    ]).then(([eventsData, featuredData, catData])=>{
      setEvents(eventsData.events);
      setFeatured(featuredData.events);
      setCategories(catData.categories);
    }).catch(console.error).finally(()=>setLoading(false));
  },[]);

  function fetchByCategory(cat) {
    setActiveCategory(cat); setLoading(true);
    const url = new URL(`${API_URL}/api/events`);
    if(cat!=="All") url.searchParams.set("category",cat);
    if(searchQuery)  url.searchParams.set("q",searchQuery);
    fetch(url.toString()).then(r=>r.json()).then(data=>setEvents(data.events))
      .catch(console.error).finally(()=>setLoading(false));
  }

  const filteredEvents = searchQuery
    ? events.filter(e=>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : events;

  return (
    <div className="min-h-screen" style={{backgroundColor:"#080c14"}}>

      {/* Sticky header */}
      <div className="sticky top-0 z-10"
        style={{backgroundColor:"rgba(8,12,20,0.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-black"
              style={{backgroundColor:"#22d3ee"}}>📅</div>
            <div>
              <h1 className="text-lg font-bold text-white">Campus Events</h1>
              <p className="text-xs" style={{color:"rgba(255,255,255,0.4)"}}>Stay updated with campus activities</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:"rgba(255,255,255,0.35)"}}>🔍</span>
            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full text-sm outline-none transition-all"
              style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"white",
                borderRadius:"12px",padding:"9px 14px 9px 44px"}}
              onFocus={e=>e.target.style.borderColor="rgba(34,211,238,0.5)"}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
            {searchQuery&&(
              <button onClick={()=>setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{color:"rgba(255,255,255,0.35)"}}>✕</button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat=>(
              <button key={cat} onClick={()=>fetchByCategory(cat)}
                className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={activeCategory===cat
                  ?{backgroundColor:"#22d3ee",color:"#080c14"}
                  :{backgroundColor:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.08)"}}>
                {cat!=="All"&&categoryEmojis[cat]?`${categoryEmojis[cat]} `:""}{cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Featured */}
        {activeCategory==="All"&&!searchQuery&&featured.length>0&&(
          <div className="mb-8">
            <h2 className="text-base font-bold text-white mb-4">⭐ Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map(event=><EventCard key={event.id} event={event} featured/>)}
            </div>
          </div>
        )}

        {/* All events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">
              {activeCategory==="All"?"All Events":`${activeCategory} Events`}
            </h2>
            <span className="text-sm" style={{color:"rgba(255,255,255,0.35)"}}>
              {filteredEvents.length} event{filteredEvents.length!==1?"s":""}
            </span>
          </div>

          {loading?(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i=>(
                <div key={i} className="rounded-2xl h-64 animate-pulse"
                  style={{backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}/>
              ))}
            </div>
          ):filteredEvents.length>0?(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event=><EventCard key={event.id} event={event}/>)}
            </div>
          ):(
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg font-medium text-white mb-1">No events found</p>
              <p className="text-sm" style={{color:"rgba(255,255,255,0.4)"}}>
                Try a different category or clear your search
              </p>
              <button onClick={()=>{setSearchQuery("");fetchByCategory("All");}}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-black"
                style={{backgroundColor:"#22d3ee"}}>
                Show All Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
