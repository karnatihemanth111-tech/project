// lib/campusData.js
// Campus nodes with SVG positions and metadata — 10 locations

export const campusNodes = {
  maingate: {
    id: "maingate", label: "Main Gate", shortLabel: "Gate",
    x: 550, y: 610, color: "#f59e0b", icon: "🚪",
    description: "Main entrance and exit of the campus",
  },
  parking: {
    id: "parking", label: "Parking", shortLabel: "Parking",
    x: 180, y: 545, color: "#64748b", icon: "🅿️",
    description: "Student and staff vehicle parking area",
  },
  canteen: {
    id: "canteen", label: "Canteen", shortLabel: "Canteen",
    x: 550, y: 480, color: "#f97316", icon: "🍽️",
    description: "Food court, dining hall and refreshment stalls",
  },
  auditorium: {
    id: "auditorium", label: "Auditorium", shortLabel: "Auditorium",
    x: 900, y: 480, color: "#c084fc", icon: "🎭",
    description: "Main auditorium for events, seminars and convocations",
  },
  admission: {
    id: "admission", label: "Admission Block", shortLabel: "Admission",
    x: 180, y: 340, color: "#fb923c", icon: "📋",
    description: "Student admissions office, counseling center and administrative services",
  },
  digital: {
    id: "digital", label: "Digital Block", shortLabel: "Digital",
    x: 550, y: 340, color: "#f472b6", icon: "📡",
    description: "Digital media, design studios and multimedia production labs",
  },
  chemical: {
    id: "chemical", label: "Chemical Block", shortLabel: "Chemical",
    x: 900, y: 340, color: "#a3e635", icon: "⚗️",
    description: "Chemistry and biotechnology laboratories with research facilities",
  },
  cyber: {
    id: "cyber", label: "Cyber Block", shortLabel: "Cyber",
    x: 180, y: 160, color: "#22d3ee", icon: "💻",
    description: "Computer science and IT departments with labs and research centers",
  },
  hitech: {
    id: "hitech", label: "Hitech Block", shortLabel: "Hitech",
    x: 550, y: 160, color: "#818cf8", icon: "🔬",
    description: "Advanced technology labs including robotics, electronics and innovation hub",
  },
  sjb: {
    id: "sjb", label: "SJB Block", shortLabel: "SJB",
    x: 900, y: 160, color: "#34d399", icon: "🏛️",
    description: "Main academic block with classrooms, faculty offices and administration",
  },
};

// Weighted graph (distances in metres)
export const campusGraph = {
  maingate:   { canteen: 80, parking: 120, auditorium: 150 },
  parking:    { maingate: 120, admission: 80 },
  canteen:    { maingate: 80, admission: 100, digital: 80, auditorium: 120 },
  auditorium: { maingate: 150, canteen: 120, chemical: 80 },
  admission:  { parking: 80, canteen: 100, digital: 120, cyber: 100 },
  digital:    { canteen: 80, admission: 120, chemical: 120, hitech: 100 },
  chemical:   { auditorium: 80, digital: 120, sjb: 100 },
  cyber:      { admission: 100, hitech: 120 },
  hitech:     { cyber: 120, digital: 100, sjb: 120 },
  sjb:        { hitech: 120, chemical: 100 },
};

export const MAP_WIDTH  = 1100;
export const MAP_HEIGHT = 680;

export const walkwayEdges = [
  ["maingate",   "canteen"],
  ["maingate",   "parking"],
  ["maingate",   "auditorium"],
  ["canteen",    "admission"],
  ["canteen",    "digital"],
  ["canteen",    "auditorium"],
  ["parking",    "admission"],
  ["auditorium", "chemical"],
  ["admission",  "digital"],
  ["digital",    "chemical"],
  ["admission",  "cyber"],
  ["digital",    "hitech"],
  ["chemical",   "sjb"],
  ["cyber",      "hitech"],
  ["hitech",     "sjb"],
  ["admission",  "hitech"],
  ["digital",    "sjb"],
];
