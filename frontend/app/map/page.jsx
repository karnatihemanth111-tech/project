"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Campus layout (1100 × 680 viewBox) ──────────────────────────────────────
const NODES = {
  maingate:   { id:"maingate",   label:"Main Gate",      short:"Gate",      x:550,  y:610, icon:"🚪", color:"#f59e0b", w:120, h:60 },
  parking:    { id:"parking",    label:"Parking",         short:"Parking",   x:180,  y:545, icon:"🅿️", color:"#64748b", w:120, h:60 },
  canteen:    { id:"canteen",    label:"Canteen",         short:"Canteen",   x:550,  y:480, icon:"🍽️", color:"#f97316", w:120, h:60 },
  auditorium: { id:"auditorium", label:"Auditorium",      short:"Auditorium",x:900,  y:480, icon:"🎭", color:"#c084fc", w:140, h:65 },
  admission:  { id:"admission",  label:"Admission Block", short:"Admission", x:180,  y:340, icon:"📋", color:"#fb923c", w:140, h:70 },
  digital:    { id:"digital",    label:"Digital Block",   short:"Digital",   x:550,  y:340, icon:"📡", color:"#f472b6", w:130, h:70 },
  chemical:   { id:"chemical",   label:"Chemical Block",  short:"Chemical",  x:900,  y:340, icon:"⚗️", color:"#a3e635", w:140, h:70 },
  cyber:      { id:"cyber",      label:"Cyber Block",     short:"Cyber",     x:180,  y:160, icon:"💻", color:"#22d3ee", w:130, h:70 },
  hitech:     { id:"hitech",     label:"Hitech Block",    short:"Hitech",    x:550,  y:160, icon:"🔬", color:"#818cf8", w:130, h:70 },
  sjb:        { id:"sjb",        label:"SJB Block",       short:"SJB",       x:900,  y:160, icon:"🏛️", color:"#34d399", w:130, h:70 },
};

// Edge waypoints — all movements go along defined road lines
const EDGES = [
  // Entry roads
  { from:"maingate",   to:"canteen",    w:2, dist:"80m",  pts:[{x:550,y:570},{x:550,y:515}] },
  { from:"maingate",   to:"parking",    w:2, dist:"120m", pts:[{x:430,y:610},{x:180,y:610},{x:180,y:580}] },
  { from:"maingate",   to:"auditorium", w:3, dist:"150m", pts:[{x:680,y:610},{x:900,y:610},{x:900,y:515}] },
  // Middle row connections
  { from:"canteen",    to:"admission",  w:2, dist:"100m", pts:[{x:430,y:480},{x:180,y:480},{x:180,y:375}] },
  { from:"canteen",    to:"digital",    w:2, dist:"80m",  pts:[{x:550,y:445},{x:550,y:375}] },
  { from:"canteen",    to:"auditorium", w:2, dist:"120m", pts:[{x:680,y:480},{x:900,y:480}] },  // already connected but shortcut
  { from:"parking",    to:"admission",  w:2, dist:"80m",  pts:[{x:180,y:510},{x:180,y:375}] },
  { from:"auditorium", to:"chemical",   w:2, dist:"80m",  pts:[{x:900,y:445},{x:900,y:375}] },
  // Academic row - horizontal
  { from:"admission",  to:"digital",    w:2, dist:"120m", pts:[{x:315,y:340},{x:485,y:340}] },
  { from:"digital",    to:"chemical",   w:2, dist:"120m", pts:[{x:615,y:340},{x:830,y:340}] },
  // Academic to upper row
  { from:"admission",  to:"cyber",      w:3, dist:"100m", pts:[{x:180,y:305},{x:180,y:195}] },
  { from:"digital",    to:"hitech",     w:2, dist:"100m", pts:[{x:550,y:305},{x:550,y:195}] },
  { from:"chemical",   to:"sjb",        w:3, dist:"100m", pts:[{x:900,y:305},{x:900,y:195}] },
  // Upper row - horizontal
  { from:"cyber",      to:"hitech",     w:2, dist:"120m", pts:[{x:315,y:160},{x:485,y:160}] },
  { from:"hitech",     to:"sjb",        w:2, dist:"120m", pts:[{x:615,y:160},{x:835,y:160}] },
  // Cross shortcuts
  { from:"admission",  to:"hitech",     w:4, dist:"200m", pts:[{x:180,y:250},{x:550,y:250}] },
  { from:"digital",    to:"sjb",        w:3, dist:"160m", pts:[{x:550,y:250},{x:900,y:250}] },
];

// ─── Dijkstra ─────────────────────────────────────────────────────────────────
function buildGraph() {
  const g = {};
  Object.keys(NODES).forEach(n => (g[n] = []));
  EDGES.forEach(e => {
    g[e.from].push({ to:e.to, w:e.w, dist:e.dist, pts:e.pts });
    g[e.to].push({ to:e.from, w:e.w, dist:e.dist, pts:[...e.pts].reverse() });
  });
  return g;
}

function dijkstra(src, dst) {
  const g = buildGraph();
  const d = {}, prev = {}, prevEdge = {};
  Object.keys(NODES).forEach(n => (d[n] = Infinity));
  d[src] = 0;
  const q = [{ n:src, c:0 }];
  while (q.length) {
    q.sort((a,b) => a.c - b.c);
    const { n } = q.shift();
    if (n === dst) break;
    for (const e of g[n]) {
      const nd = d[n] + e.w;
      if (nd < d[e.to]) {
        d[e.to] = nd; prev[e.to] = n;
        prevEdge[e.to] = { dist:e.dist, pts:e.pts };
        q.push({ n:e.to, c:nd });
      }
    }
  }
  const path = [];
  let c = dst;
  while (c) { path.unshift(c); c = prev[c]; }
  return path.length > 1 ? { path, prevEdge } : null;
}

// ─── Polyline helpers ─────────────────────────────────────────────────────────
function buildPoly(path, prevEdge) {
  const pts = [{ x:NODES[path[0]].x, y:NODES[path[0]].y, seg:0 }];
  path.slice(1).forEach((id, i) => {
    (prevEdge[id]?.pts || []).forEach(p => pts.push({ x:p.x, y:p.y, seg:i }));
    pts.push({ x:NODES[id].x, y:NODES[id].y, seg:i });
  });
  return pts;
}
function polyToD(pts) { return pts.map((p,i) => `${i===0?"M":"L"}${p.x},${p.y}`).join(" "); }
function polyLen(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx=pts[i].x-pts[i-1].x, dy=pts[i].y-pts[i-1].y;
    l += Math.sqrt(dx*dx+dy*dy);
  }
  return l;
}
function segLens(pts) {
  return pts.slice(0,-1).map((_,i)=>{
    const dx=pts[i+1].x-pts[i].x, dy=pts[i+1].y-pts[i].y;
    return Math.sqrt(dx*dx+dy*dy);
  });
}
function dotAt(pts, p) {
  const lens = segLens(pts);
  const total = lens.reduce((s,l)=>s+l,0);
  let rem = Math.min(p,1)*total;
  for (let i=0; i<lens.length; i++) {
    if (rem <= lens[i]+1e-6) {
      const t = lens[i]<1e-6 ? 0 : Math.min(rem/lens[i],1);
      return { x:pts[i].x+(pts[i+1].x-pts[i].x)*t, y:pts[i].y+(pts[i+1].y-pts[i].y)*t, seg:pts[i].seg };
    }
    rem -= lens[i];
  }
  const last = pts[pts.length-1];
  return { x:last.x, y:last.y, seg:last.seg };
}

// ─── Direction ────────────────────────────────────────────────────────────────
function dirLabel(ax,ay,bx,by) {
  const a = Math.atan2(by-ay,bx-ax)*(180/Math.PI);
  if (a>-22.5 && a<=22.5)   return {lbl:"East",       arrow:"→"};
  if (a>22.5  && a<=67.5)   return {lbl:"South-East", arrow:"↘"};
  if (a>67.5  && a<=112.5)  return {lbl:"South",      arrow:"↓"};
  if (a>112.5 && a<=157.5)  return {lbl:"South-West", arrow:"↙"};
  if (a>157.5 || a<=-157.5) return {lbl:"West",       arrow:"←"};
  if (a>-157.5&& a<=-112.5) return {lbl:"North-West", arrow:"↖"};
  if (a>-112.5&& a<=-67.5)  return {lbl:"North",      arrow:"↑"};
  return {lbl:"North-East",arrow:"↗"};
}
function buildSteps(path, prevEdge) {
  return path.slice(0,-1).map((id,i) => {
    const f=NODES[id], t=NODES[path[i+1]];
    const dir=dirLabel(f.x,f.y,t.x,t.y);
    const d=prevEdge[path[i+1]]?.dist||"~100m";
    return { fromLabel:f.label, toLabel:t.label, toShort:t.short,
             icon:t.icon, color:t.color, dir, dist:d,
             time:`~${Math.ceil(parseInt(d)/60)} min` };
  });
}

// ─── Voice (ref-based, stale-closure-free) ────────────────────────────────────
function useVoice() {
  const [on, setOn]           = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const synth  = useRef(null);
  const onRef  = useRef(false);

  useEffect(()=>{ if("speechSynthesis" in window){setSupported(true);synth.current=window.speechSynthesis;} },[]);
  useEffect(()=>{ onRef.current=on; },[on]);

  const speak = useCallback((text, interrupt=false) => {
    if(!synth.current||!onRef.current) return;
    if(interrupt) synth.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate=0.88; u.pitch=1.0;
    u.onstart=()=>setSpeaking(true);
    u.onend=()=>setSpeaking(false);
    u.onerror=()=>setSpeaking(false);
    synth.current.speak(u);
  },[]);

  const cancel = useCallback(()=>{ synth.current?.cancel(); setSpeaking(false); },[]);
  const toggle = useCallback(()=>{ setOn(prev=>{ if(prev) synth.current?.cancel(); return !prev; }); },[]);
  return { on, speaking, supported, speak, cancel, toggle };
}

// ─── Tree component ───────────────────────────────────────────────────────────
function Tree({x,y,r=16}) {
  return (
    <g>
      <ellipse cx={x+4} cy={y+r+3} rx={r*0.65} ry={r*0.28} fill="rgba(0,0,0,0.22)"/>
      <rect x={x-2.5} y={y+r-3} width="5" height={r*0.65} rx="2" fill="#5c3d18"/>
      <circle cx={x}   cy={y+r*0.25} r={r}      fill="#1b5e20"/>
      <circle cx={x}   cy={y}        r={r*0.82}  fill="#256025"/>
      <circle cx={x}   cy={y-r*0.3}  r={r*0.62}  fill="#2e7d32"/>
      <circle cx={x-r*0.22} cy={y-r*0.08} r={r*0.28} fill="rgba(76,175,80,0.38)"/>
    </g>
  );
}

// ─── Building component ───────────────────────────────────────────────────────
function Building({ node, inPath, stepNum, isPassed, isFrom, isTo, isArrived }) {
  const { x, y, w, h, icon, color, label } = node;
  const bx = x-w/2, by = y-h/2;
  const hi = isPassed||isFrom||isTo;

  return (
    <g>
      {isArrived && <rect x={bx-9} y={by-9} width={w+18} height={h+18} rx="16"
        fill="none" stroke="#34d399" strokeWidth="2.5" opacity="0.65"/>}
      {inPath && <rect x={bx-5} y={by-5} width={w+10} height={h+10} rx="13"
        fill={`${color}0D`} stroke={`${color}40`} strokeWidth="1.5"/>}
      {/* Depth */}
      <rect x={bx+w} y={by+7} width={9} height={h-7} fill={isPassed?`${color}18`:"rgba(0,0,0,0.38)"} style={{transition:"fill 0.4s"}}/>
      <rect x={bx+5} y={by+h} width={w+4} height={7} fill="rgba(0,0,0,0.28)"/>
      {/* Face */}
      <rect x={bx} y={by} width={w} height={h} rx="9"
        fill={isPassed?`${color}1F`:"#172138"}
        stroke={hi?color:"rgba(255,255,255,0.13)"} strokeWidth={hi?2:1}
        style={{transition:"fill 0.4s,stroke 0.4s"}}/>
      {/* Roof */}
      <rect x={bx+6} y={by+4} width={w-12} height={7} rx="4"
        fill={isPassed?`${color}30`:"rgba(255,255,255,0.05)"} style={{transition:"fill 0.4s"}}/>
      {/* Windows */}
      {Array.from({length:Math.max(2,Math.floor(w/38))}).map((_,wi)=>(
        <g key={wi}>
          <rect x={bx+12+wi*34} y={by+18} width={18} height={22} rx="3"
            fill={isPassed?`${color}20`:"rgba(148,196,255,0.07)"}
            stroke={isPassed?`${color}45`:"rgba(255,255,255,0.08)"} strokeWidth="0.5"/>
          <rect x={bx+10+wi*34} y={by+39} width={22} height={2} rx="1" fill="rgba(255,255,255,0.07)"/>
        </g>
      ))}
      {/* Door */}
      <rect x={x-7} y={by+h-21} width={14} height={21} rx="3"
        fill={isPassed?`${color}25`:"rgba(80,58,28,0.55)"}
        stroke={isPassed?color:"rgba(255,255,255,0.1)"} strokeWidth="0.5"/>
      {/* Icon */}
      <text x={x} y={y+3} textAnchor="middle" dominantBaseline="middle" fontSize="18">{icon}</text>
      {/* Step badge */}
      {inPath&&stepNum>=0&&(
        <g>
          <circle cx={bx+w+3} cy={by-3} r="12"
            fill={isPassed?color:"#080c14"} stroke={isPassed?"transparent":color} strokeWidth="2"/>
          <text x={bx+w+3} y={by-3} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontWeight="900" fill={isPassed?"#080c14":color}>{stepNum+1}</text>
        </g>
      )}
      {/* Label */}
      <text x={x} y={by+h+15} textAnchor="middle" fontSize="10.5" fontWeight="800"
        fill={isPassed?color:inPath?`${color}90`:"rgba(255,255,255,0.62)"}
        style={{transition:"fill 0.4s"}}>{label}</text>
    </g>
  );
}

// ─── Static campus decorations ────────────────────────────────────────────────
const TREES = [
  // Perimeter
  {x:45,y:42,r:18},{x:90,y:38,r:14},{x:160,y:38,r:15},
  {x:990,y:42,r:18},{x:1045,y:38,r:14},{x:945,y:38,r:15},
  {x:45,y:635,r:18},{x:90,y:638,r:14},{x:160,y:638,r:15},
  {x:990,y:635,r:18},{x:1045,y:638,r:14},{x:945,y:638,r:15},
  // Left strip
  {x:48,y:160,r:15},{x:48,y:240,r:13},{x:48,y:340,r:15},{x:48,y:430,r:13},{x:48,y:540,r:14},
  // Right strip
  {x:1055,y:160,r:15},{x:1055,y:250,r:13},{x:1055,y:340,r:15},{x:1055,y:430,r:13},{x:1055,y:540,r:14},
  // Central garden (around plaza)
  {x:340,y:250,r:16},{x:370,y:255,r:13},{x:730,y:250,r:16},{x:760,y:255,r:13},
  {x:340,y:420,r:15},{x:366,y:415,r:12},{x:730,y:420,r:15},{x:758,y:415,r:12},
  // Scattered
  {x:380,y:60,r:14},{x:730,y:60,r:14},{x:380,y:620,r:14},{x:730,y:620,r:14},
  {x:80,y:430,r:13},{x:1020,y:430,r:13},{x:80,y:260,r:13},{x:1020,y:260,r:13},
];

const LAMP_POSTS = [
  {x:340,y:160},{x:760,y:160},{x:340,y:340},{x:760,y:340},
  {x:180,y:250},{x:900,y:250},{x:550,y:410},{x:550,y:590},
];

const BENCHES = [
  {x:340,y:152},{x:760,y:152},{x:340,y:332},{x:760,y:332},
  {x:170,y:250},{x:892,y:250},{x:542,y:405},
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MapPage() {
  const [from, setFrom]           = useState("");
  const [to,   setTo]             = useState("");
  const [result, setResult]       = useState(null);
  const [progress, setProgress]   = useState(0);
  const [activeSeg, setActiveSeg] = useState(-1);
  const [error, setError]         = useState("");
  const [running, setRunning]     = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const rafRef      = useRef(null);
  const startRef    = useRef(null);
  const pausedProg  = useRef(0);
  const spokenSeg   = useRef(-1);
  const resultRef   = useRef(null);
  const fromRef     = useRef("");
  const toRef       = useRef("");
  const polyRef     = useRef(null);
  const lenRef      = useRef(0);

  useEffect(()=>{ resultRef.current=result; },[result]);
  useEffect(()=>{ fromRef.current=from; },[from]);
  useEffect(()=>{ toRef.current=to; },[to]);

  const voice  = useVoice();
  const SPEED  = 42; // px/sec

  function clearNav() {
    cancelAnimationFrame(rafRef.current);
    voice.cancel();
    pausedProg.current=0; spokenSeg.current=-1;
    polyRef.current=null; lenRef.current=0;
  }

  const handleFind = useCallback(()=>{
    clearNav();
    setError(""); setResult(null); setProgress(0); setActiveSeg(-1); setRunning(false);
    if(!from||!to)  return setError("Select both locations.");
    if(from===to)   return setError("Start and destination can't be the same.");
    const found = dijkstra(from,to);
    if(!found)      return setError("No path found.");
    const steps = buildSteps(found.path,found.prevEdge);
    const poly  = buildPoly(found.path,found.prevEdge);
    const len   = polyLen(poly);
    polyRef.current=poly; lenRef.current=len;
    setResult({...found,steps,poly,len,dStr:polyToD(poly)});
  },[from,to]);

  const tick = useCallback((now)=>{
    const r=resultRef.current, pts=polyRef.current;
    if(!r||!pts) return;
    const dur=(lenRef.current/SPEED)*1000;
    const p=Math.min((now-startRef.current)/dur,1);
    setProgress(p); pausedProg.current=p;
    const pos=dotAt(pts,p);
    setActiveSeg(pos.seg);
    if(pos.seg!==spokenSeg.current&&pos.seg<r.steps.length){
      spokenSeg.current=pos.seg;
      const s=r.steps[pos.seg], rem=r.steps.length-pos.seg;
      voice.speak(
        `${s.dir.arrow} Head ${s.dir.lbl} toward ${s.toLabel}. ${s.dist}. `+
        (rem>1?`${rem-1} more turn${rem-1>1?"s":""} ahead.`:`Arriving at ${NODES[toRef.current]?.label}.`),
        true
      );
    }
    if(p<1){ rafRef.current=requestAnimationFrame(tick); }
    else {
      setRunning(false); setActiveSeg(r.steps.length);
      pausedProg.current=0; spokenSeg.current=-1;
      voice.speak(`You have arrived at ${NODES[toRef.current]?.label}. Navigation complete.`,true);
    }
  },[voice]);

  const startAnim = useCallback(()=>{
    const r=resultRef.current, pts=polyRef.current;
    if(!r||!pts) return;
    cancelAnimationFrame(rafRef.current); setRunning(true);
    const rf=pausedProg.current;
    startRef.current=performance.now()-rf*(lenRef.current/SPEED)*1000;
    if(rf===0){
      const td=r.steps.reduce((s,st)=>s+parseInt(st.dist),0);
      voice.speak(
        `Starting navigation from ${NODES[fromRef.current]?.label} to ${NODES[toRef.current]?.label}. `+
        `${r.steps.length} turn${r.steps.length!==1?"s":""}. ${td} metres total. `+
        `${r.steps[0].dir.arrow} Head ${r.steps[0].dir.lbl} toward ${r.steps[0].toLabel}.`,true
      );
      spokenSeg.current=0;
    } else {
      const seg=dotAt(pts,rf).seg;
      spokenSeg.current=seg-1;
      if(seg<r.steps.length){
        const s=r.steps[seg],rem=r.steps.length-seg;
        voice.speak(
          `Head ${s.dir.lbl} toward ${s.toLabel}. ${s.dist}. `+
          (rem>1?`${rem-1} turn${rem-1>1?"s":""} remaining.`:"Almost there."),true
        );
        spokenSeg.current=seg;
      }
    }
    rafRef.current=requestAnimationFrame(tick);
  },[tick,voice]);

  const handlePause = useCallback(()=>{ cancelAnimationFrame(rafRef.current); voice.cancel(); setRunning(false); },[voice]);
  const handleReset = useCallback(()=>{ clearNav(); setResult(null); setFrom(""); setTo(""); setProgress(0); setActiveSeg(-1); setError(""); setRunning(false); },[voice]);

  useEffect(()=>()=>cancelAnimationFrame(rafRef.current),[]);

  const dotPos    = (result&&result.poly) ? dotAt(result.poly,progress) : null;
  const arrived   = result&&progress>=1;
  const pathLen   = result?.len||0;
  const dashOff   = pathLen*(1-progress);
  const totalDist = result?result.steps.reduce((s,st)=>s+parseInt(st.dist),0)+"m":null;
  const totalTime = result?result.steps.reduce((s,st)=>s+Math.ceil(parseInt(st.dist)/60),0)+" min":null;
  const sel = {background:"#0b1a0b"};

  return (
    <div className="flex flex-col min-h-screen" style={{backgroundColor:"#080c14",color:"white",fontFamily:"system-ui,sans-serif"}}>

      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 h-14 shrink-0"
        style={{backgroundColor:"rgba(8,12,20,0.97)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{background:"linear-gradient(135deg,#22d3ee,#818cf8)",color:"#080c14"}}>CN</div>
          <div>
            <p className="text-sm font-bold leading-none">Campus Navigator</p>
            <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{color:"rgba(255,255,255,0.3)"}}>Interactive Map</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowPanel(p=>!p)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
            style={{backgroundColor:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.08)"}}>
            {showPanel?"◀ Hide":"▶ Panel"}
          </button>
          {voice.supported&&(
            <button onClick={voice.toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={{backgroundColor:voice.on?"rgba(34,211,238,0.12)":"rgba(255,255,255,0.05)",color:voice.on?"#22d3ee":"rgba(255,255,255,0.45)",border:voice.on?"1px solid rgba(34,211,238,0.25)":"1px solid rgba(255,255,255,0.08)"}}>
              <span>{voice.on?"🔊":"🔇"}</span>
              <span>{voice.on?"Voice ON":"Voice OFF"}</span>
              {voice.speaking&&[0,1,2].map(i=>(
                <span key={i} className="w-0.5 rounded-full animate-bounce inline-block"
                  style={{height:8,backgroundColor:"#22d3ee",animationDelay:`${i*0.12}s`}}/>
              ))}
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDE PANEL */}
        {showPanel&&(
          <aside className="shrink-0 overflow-y-auto flex flex-col gap-3 p-3"
            style={{width:260,backgroundColor:"rgba(6,10,18,0.98)",borderRight:"1px solid rgba(255,255,255,0.07)"}}>

            <div className="rounded-xl p-4" style={{backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{color:"#22d3ee"}}>Route Planner</p>

              <p className="text-[10px] mb-1 flex items-center gap-1" style={{color:"rgba(255,255,255,0.4)"}}>
                <span className="w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center"
                  style={{background:"linear-gradient(135deg,#22d3ee,#818cf8)",color:"#080c14"}}>A</span> From
              </p>
              <select value={from}
                onChange={e=>{clearNav();setFrom(e.target.value);setResult(null);setProgress(0);setActiveSeg(-1);setRunning(false);}}
                className="w-full text-xs rounded-lg px-3 py-2 mb-2 outline-none"
                style={{backgroundColor:"rgba(255,255,255,0.05)",border:from?"1px solid rgba(34,211,238,0.4)":"1px solid rgba(255,255,255,0.1)",color:"white"}}>
                <option value="" style={sel}>Select starting point</option>
                {Object.keys(NODES).map(id=><option key={id} value={id} style={sel}>{NODES[id].icon} {NODES[id].label}</option>)}
              </select>

              <div className="flex justify-center mb-1">
                <button onClick={()=>{clearNav();const f=from,t=to;setFrom(t);setTo(f);setResult(null);setProgress(0);setActiveSeg(-1);setRunning(false);}}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{backgroundColor:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)"}}>⇅</button>
              </div>

              <p className="text-[10px] mb-1 flex items-center gap-1" style={{color:"rgba(255,255,255,0.4)"}}>
                <span className="w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center"
                  style={{backgroundColor:"#f472b6",color:"#080c14"}}>B</span> To
              </p>
              <select value={to}
                onChange={e=>{clearNav();setTo(e.target.value);setResult(null);setProgress(0);setActiveSeg(-1);setRunning(false);}}
                className="w-full text-xs rounded-lg px-3 py-2 mb-3 outline-none"
                style={{backgroundColor:"rgba(255,255,255,0.05)",border:to?"1px solid rgba(244,114,182,0.4)":"1px solid rgba(255,255,255,0.1)",color:"white"}}>
                <option value="" style={sel}>Select destination</option>
                {Object.keys(NODES).map(id=><option key={id} value={id} style={sel}>{NODES[id].icon} {NODES[id].label}</option>)}
              </select>

              {error&&(
                <div className="text-[10px] px-3 py-2 rounded-lg mb-2 flex items-center gap-1.5"
                  style={{backgroundColor:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:"#f87171"}}>
                  ⚠ {error}
                </div>
              )}

              <button onClick={handleFind}
                className="w-full py-2 rounded-xl font-bold text-sm mb-2 active:scale-95 transition-all"
                style={{background:"linear-gradient(135deg,#22d3ee,#818cf8)",color:"#080c14"}}>
                🔍 Find Route
              </button>

              <div className="flex gap-2">
                {result&&!running&&!arrived&&(
                  <button onClick={startAnim}
                    className="flex-1 py-2 rounded-xl font-bold text-xs active:scale-95"
                    style={{backgroundColor:"rgba(34,211,238,0.12)",color:"#22d3ee",border:"1px solid rgba(34,211,238,0.3)"}}>
                    {pausedProg.current>0?"▶ Resume":"▶ Start"}
                  </button>
                )}
                {running&&(
                  <button onClick={handlePause}
                    className="flex-1 py-2 rounded-xl font-bold text-xs active:scale-95"
                    style={{backgroundColor:"rgba(251,191,36,0.12)",color:"#fbbf24",border:"1px solid rgba(251,191,36,0.3)"}}>
                    ⏸ Pause
                  </button>
                )}
                {result&&(
                  <button onClick={handleReset}
                    className="px-3 py-2 rounded-xl text-xs"
                    style={{backgroundColor:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.08)"}}>✕</button>
                )}
              </div>
            </div>

            {/* Summary */}
            {result&&(
              <div className="rounded-xl p-4"
                style={{backgroundColor:arrived?"rgba(52,211,153,0.07)":"rgba(34,211,238,0.05)",border:`1px solid ${arrived?"rgba(52,211,153,0.25)":"rgba(34,211,238,0.15)"}`}}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2"
                  style={{color:arrived?"#34d399":running?"#22d3ee":"rgba(255,255,255,0.38)"}}>
                  {arrived?"✅ Arrived":running?"🔵 Navigating…":pausedProg.current>0?"⏸ Paused":"🧭 Summary"}
                </p>
                {(running||arrived||pausedProg.current>0)&&(
                  <div className="mb-2">
                    <div className="flex justify-between text-[9px] mb-0.5" style={{color:"rgba(255,255,255,0.3)"}}>
                      <span>Progress</span><span>{Math.round(progress*100)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{backgroundColor:"rgba(255,255,255,0.08)"}}>
                      <div className="h-full rounded-full" style={{width:`${progress*100}%`,backgroundColor:arrived?"#34d399":"#22d3ee",transition:"width 0.08s linear"}}/>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[{l:"Distance",v:totalDist},{l:"Walk Time",v:totalTime}].map(({l,v})=>(
                    <div key={l} className="rounded-lg p-2 text-center" style={{backgroundColor:"rgba(255,255,255,0.04)"}}>
                      <p className="text-[8px] uppercase tracking-widest mb-0.5" style={{color:"rgba(255,255,255,0.3)"}}>{l}</p>
                      <p className="text-base font-black">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-2" style={{backgroundColor:"rgba(255,255,255,0.04)"}}>
                  <p className="text-[8px] uppercase tracking-widest mb-1" style={{color:"rgba(255,255,255,0.3)"}}>Path</p>
                  <p className="text-[10px] font-semibold">{result.path.map(id=>NODES[id].short).join(" → ")}</p>
                </div>
              </div>
            )}

            {/* Directions */}
            {result&&(
              <div className="rounded-xl overflow-hidden" style={{backgroundColor:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)"}}>
                <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest"
                  style={{color:"rgba(255,255,255,0.3)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>Directions</p>

                <div className="px-3 py-2 flex items-center gap-2" style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black shrink-0"
                    style={{background:"linear-gradient(135deg,#22d3ee,#818cf8)",color:"#080c14"}}>A</div>
                  <p className="text-[11px] font-semibold">{NODES[from]?.label}</p>
                </div>

                {result.steps.map((step,i)=>{
                  const done=activeSeg>i, active=activeSeg===i&&(running||pausedProg.current>0);
                  return(
                    <div key={i} className="px-3 py-2.5 flex items-center gap-2 transition-all"
                      style={{backgroundColor:active?"rgba(34,211,238,0.07)":"transparent",borderLeft:active?"3px solid #22d3ee":"3px solid transparent",borderBottom:"1px solid rgba(255,255,255,0.04)",opacity:done?0.42:1}}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black shrink-0"
                        style={{backgroundColor:done?"rgba(34,211,238,0.1)":active?"rgba(34,211,238,0.15)":"rgba(255,255,255,0.04)",color:done||active?"#22d3ee":"rgba(255,255,255,0.3)",border:active?"1px solid rgba(34,211,238,0.4)":"1px solid rgba(255,255,255,0.07)"}}>
                        {done?"✓":step.dir.arrow}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold leading-snug" style={{color:active?"#e0f8fc":"rgba(255,255,255,0.7)"}}>
                          Head <span style={{color:active?"#22d3ee":"white",fontWeight:700}}>{step.dir.lbl}</span> → {step.toShort} {step.icon}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{color:"rgba(255,255,255,0.28)"}}>{step.dist} · {step.time}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="px-3 py-2.5 flex items-center gap-2"
                  style={{backgroundColor:arrived?"rgba(52,211,153,0.07)":"transparent",borderLeft:arrived?"3px solid #34d399":"3px solid transparent",opacity:arrived?1:0.35}}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                    style={{backgroundColor:arrived?"rgba(52,211,153,0.15)":"rgba(255,255,255,0.04)"}}>
                    {arrived?"🏁":"📍"}
                  </div>
                  <p className="text-[11px] font-semibold" style={{color:arrived?"#34d399":"rgba(255,255,255,0.4)"}}>
                    {arrived?"You have arrived!":NODES[to]?.label}
                  </p>
                </div>
              </div>
            )}

            {/* Building list */}
            <div className="rounded-xl p-3" style={{backgroundColor:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{color:"rgba(255,255,255,0.25)"}}>All Locations</p>
              {Object.values(NODES).map(node=>(
                <div key={node.id} className="flex items-center gap-2 py-1">
                  <span className="text-sm">{node.icon}</span>
                  <span className="text-[10px]" style={{color:result?.path.includes(node.id)?"rgba(255,255,255,0.82)":"rgba(255,255,255,0.35)"}}>
                    {node.label}
                  </span>
                  {result?.path.includes(node.id)&&<span className="ml-auto w-1 h-1 rounded-full shrink-0" style={{backgroundColor:node.color}}/>}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ─── MAP ─── */}
        <div className="flex-1 flex items-stretch p-3 overflow-hidden">
          <svg viewBox="0 0 1100 680" className="w-full h-full rounded-2xl"
            style={{maxHeight:"calc(100vh - 3.5rem - 24px)",border:"1px solid rgba(255,255,255,0.08)"}}>
            <defs>
              <radialGradient id="ground" cx="50%" cy="50%" r="70%">
                <stop offset="0%"  stopColor="#1c5c1c"/>
                <stop offset="60%" stopColor="#164e16"/>
                <stop offset="100%" stopColor="#0f360f"/>
              </radialGradient>
              <pattern id="groundGrid" width="55" height="55" patternUnits="userSpaceOnUse">
                <path d="M55 0L0 0 0 55" fill="none" stroke="rgba(255,255,255,0.016)" strokeWidth="0.5"/>
              </pattern>
              <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="pathGlow" x="-20%" y="-100%" width="140%" height="300%">
                <feGaussianBlur stdDeviation="4" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="bldShadow">
                <feDropShadow dx="3" dy="5" stdDeviation="5" floodColor="rgba(0,0,0,0.55)"/>
              </filter>
              <marker id="dimArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(180,160,80,0.22)"/>
              </marker>
            </defs>

            {/* Ground */}
            <rect width="1100" height="680" fill="url(#ground)"/>
            <rect width="1100" height="680" fill="url(#groundGrid)"/>

            {/* Campus outer wall */}
            <rect x="14" y="14" width="1072" height="652" rx="20"
              fill="none" stroke="rgba(130,210,130,0.2)" strokeWidth="3" strokeDasharray="16 8"/>

            {/* Inner campus boundary */}
            <rect x="70" y="70" width="960" height="540" rx="14"
              fill="rgba(255,255,255,0.008)" stroke="rgba(130,200,130,0.08)" strokeWidth="1"/>

            {/* Central plaza area */}
            <rect x="280" y="224" width="540" height="232" rx="12"
              fill="rgba(210,190,100,0.045)" stroke="rgba(210,190,100,0.09)" strokeWidth="1"/>
            {/* Plaza tiles */}
            {Array.from({length:6}).map((_,i)=>(
              <rect key={i} x={295+i*87} y={238} width={75} height={200} rx="5"
                fill="rgba(200,180,90,0.025)" stroke="rgba(200,180,90,0.06)" strokeWidth="0.5"/>
            ))}
            {/* Fountain */}
            <circle cx="550" cy="340" r="30" fill="rgba(20,160,210,0.07)" stroke="rgba(20,160,210,0.15)" strokeWidth="1.5"/>
            <circle cx="550" cy="340" r="17" fill="rgba(20,160,210,0.1)"  stroke="rgba(20,160,210,0.25)" strokeWidth="1"/>
            <circle cx="550" cy="340" r="6"  fill="rgba(20,160,210,0.4)"/>
            <text x="550" y="344" textAnchor="middle" fontSize="11" fill="rgba(20,200,240,0.8)">⛲</text>

            {/* ── WALKWAYS ── */}
            {EDGES.map((edge,i)=>{
              const pts=[NODES[edge.from],...edge.pts,NODES[edge.to]];
              const d=pts.map((p,j)=>`${j===0?"M":"L"}${p.x},${p.y}`).join(" ");
              const mid=pts[Math.floor(pts.length/2)];
              return(
                <g key={i}>
                  <path d={d} fill="none" stroke="rgba(180,160,80,0.16)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d={d} fill="none" stroke="#1e1c14" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d={d} fill="none" stroke="rgba(220,200,100,0.16)" strokeWidth="1.5"
                    strokeDasharray="11 9" strokeLinecap="round" markerEnd="url(#dimArrow)"/>
                  <text x={mid.x} y={mid.y-14} textAnchor="middle" fontSize="8" fontWeight="600"
                    fill="rgba(210,190,100,0.42)">{edge.dist}</text>
                </g>
              );
            })}

            {/* ── ACTIVE ROUTE (dashoffset reveal) ── */}
            {result&&(
              <g>
                {/* Glow */}
                <path d={result.dStr} fill="none" stroke="#22d3ee" strokeWidth="16"
                  strokeLinecap="round" strokeLinejoin="round" opacity={0.07}
                  strokeDasharray={`${pathLen} ${pathLen}`} strokeDashoffset={dashOff}
                  style={{transition:"stroke-dashoffset 0.06s linear"}}/>
                {/* Main line */}
                <path d={result.dStr} fill="none" stroke="#22d3ee" strokeWidth="4.5"
                  strokeLinecap="round" strokeLinejoin="round" filter="url(#pathGlow)"
                  strokeDasharray={`${pathLen} ${pathLen}`} strokeDashoffset={dashOff}
                  style={{transition:"stroke-dashoffset 0.06s linear"}}/>
                {/* Flowing ants */}
                <path d={result.dStr} fill="none" stroke="rgba(130,245,255,0.5)"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="9 16"
                  strokeDashoffset={dashOff}
                  style={{transition:"stroke-dashoffset 0.06s linear",animation:running?"flowDash 0.65s linear infinite":"none"}}/>

                {/* Direction label on active segment */}
                {result.steps.map((step,i)=>{
                  if(activeSeg!==i) return null;
                  const f=NODES[result.path[i]], t=NODES[result.path[i+1]];
                  const edge=EDGES.find(e=>(e.from===result.path[i]&&e.to===result.path[i+1])||(e.to===result.path[i]&&e.from===result.path[i+1]));
                  const wpts=edge?(edge.from===result.path[i]?edge.pts:[...edge.pts].reverse()):[];
                  const all=[f,...wpts,t];
                  const mid=all[Math.floor(all.length/2)];
                  return(
                    <g key={i}>
                      <rect x={mid.x-34} y={mid.y-28} width="68" height="20" rx="7"
                        fill="rgba(8,12,20,0.92)" stroke="rgba(34,211,238,0.65)" strokeWidth="1"/>
                      <text x={mid.x} y={mid.y-14} textAnchor="middle" fontSize="12" fontWeight="900" fill="#22d3ee">
                        {step.dir.arrow} {step.dir.lbl}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* ── TREES ── */}
            {TREES.map((t,i)=><Tree key={i} {...t}/>)}

            {/* ── LAMP POSTS ── */}
            {LAMP_POSTS.map((lp,i)=>(
              <g key={i}>
                <rect x={lp.x-2} y={lp.y-20} width="4" height="20" rx="2" fill="#3a3530"/>
                <circle cx={lp.x} cy={lp.y-20} r="4.5" fill="#2a2820" stroke="rgba(255,225,90,0.35)" strokeWidth="1"/>
                <circle cx={lp.x} cy={lp.y-20} r="2.5" fill="rgba(255,225,90,0.75)"/>
                <circle cx={lp.x} cy={lp.y-20} r="9"   fill="rgba(255,210,70,0.04)"/>
              </g>
            ))}

            {/* ── BENCHES ── */}
            {BENCHES.map((b,i)=>(
              <g key={i}>
                <rect x={b.x-14} y={b.y-3} width="28" height="7" rx="3" fill="#4a3a22" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
                <rect x={b.x-12} y={b.y-10} width="5" height="8" rx="1.5" fill="#3a2a14"/>
                <rect x={b.x+7}  y={b.y-10} width="5" height="8" rx="1.5" fill="#3a2a14"/>
              </g>
            ))}

            {/* ── BUILDINGS ── */}
            {Object.values(NODES).map(node=>{
              const inPath=result?.path.includes(node.id);
              const idx=result?result.path.indexOf(node.id):-1;
              const isPassed=inPath&&idx>=0&&idx<=activeSeg;
              return(
                <g key={node.id} filter="url(#bldShadow)">
                  <Building node={node} inPath={inPath} stepNum={idx}
                    isPassed={isPassed} isFrom={from===node.id} isTo={to===node.id}
                    isArrived={arrived&&to===node.id}/>
                </g>
              );
            })}

            {/* Route start/end flags */}
            {result&&(
              <>
                <text x={NODES[result.path[0]].x}
                  y={NODES[result.path[0]].y - NODES[result.path[0]].h/2 - 32}
                  textAnchor="middle" fontSize="22">🚩</text>
                <text x={NODES[result.path[result.path.length-1]].x}
                  y={NODES[result.path[result.path.length-1]].y - NODES[result.path[result.path.length-1]].h/2 - 32}
                  textAnchor="middle" fontSize="22">{arrived?"🏁":"🎯"}</text>
              </>
            )}

            {/* ── CLEAN DOT ── */}
            {dotPos&&(
              <g filter="url(#dotGlow)">
                <ellipse cx={dotPos.x+3} cy={dotPos.y+11} rx="9" ry="4" fill="rgba(0,0,0,0.28)"/>
                <circle cx={dotPos.x} cy={dotPos.y} r="14" fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.22)" strokeWidth="1"/>
                <circle cx={dotPos.x} cy={dotPos.y} r="9"  fill="rgba(8,12,20,0.9)" stroke="#22d3ee" strokeWidth="2.5"/>
                <circle cx={dotPos.x} cy={dotPos.y} r="4.5" fill="#22d3ee"/>
                <circle cx={dotPos.x-1.5} cy={dotPos.y-1.5} r="1.5" fill="rgba(255,255,255,0.7)"/>
                {result&&activeSeg>=0&&activeSeg<result.steps.length&&(
                  <text x={dotPos.x} y={dotPos.y-24} textAnchor="middle"
                    fontSize="17" fontWeight="900" fill="#22d3ee">
                    {result.steps[activeSeg].dir.arrow}
                  </text>
                )}
              </g>
            )}

            {/* Compass */}
            <g transform="translate(1062,50)">
              <circle cx="0" cy="0" r="28" fill="rgba(8,12,20,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <text x="0" y="-10" textAnchor="middle" fontSize="10" fontWeight="800" fill="rgba(248,113,113,0.9)">N</text>
              <text x="0"  y="17"  textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)">S</text>
              <text x="-15" y="5"  textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)">W</text>
              <text x="15"  y="5"  textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)">E</text>
              <line x1="0" y1="-5" x2="0" y2="-19" stroke="rgba(248,113,113,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="0" y1="5"  x2="0" y2="13"  stroke="rgba(255,255,255,0.3)"  strokeWidth="2" strokeLinecap="round"/>
            </g>

            {/* Legend */}
            <g transform="translate(28,652)">
              <rect x="-4" y="-14" width="235" height="28" rx="8"
                fill="rgba(8,12,20,0.8)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
              <circle cx="8"  cy="0" r="5" fill="#22d3ee"/>
              <text x="19"  y="4" fontSize="9" fill="rgba(255,255,255,0.45)">Navigator</text>
              <line x1="85" y1="0" x2="108" y2="0" stroke="#22d3ee" strokeWidth="2.5"/>
              <text x="116" y="4" fontSize="9" fill="rgba(255,255,255,0.45)">Active Route</text>
              <circle cx="185" cy="0" r="5" fill="#256025"/>
              <text x="196" y="4" fontSize="9" fill="rgba(255,255,255,0.45)">Tree</text>
            </g>

            <style>{`
              @keyframes flowDash {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -25; }
              }
            `}</style>
          </svg>
        </div>
      </div>
    </div>
  );
}
