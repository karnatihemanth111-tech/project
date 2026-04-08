const express = require("express");
const router = express.Router();

const locations = [
  // ── Entry & Facilities ────────────────────────────────────────────────────
  {
    id: "maingate",
    name: "Main Gate",
    shortName: "Gate",
    description: "Main entrance and exit of the campus. Security check-post, visitor registration and campus map kiosk.",
    category: "Facility",
    floor: "Ground Level",
    facilities: ["Security Post", "Visitor Registration", "Map Kiosk", "Intercom"],
    tags: ["gate", "entrance", "exit", "security", "main", "entry"],
    coordinates: { x: 550, y: 610 },
  },
  {
    id: "parking",
    name: "Parking",
    shortName: "Parking",
    description: "Dedicated vehicle parking area for students, staff and visitors. Covered and open bays available.",
    category: "Facility",
    floor: "Ground Level",
    facilities: ["Student Parking", "Staff Parking", "Visitor Bays", "Two-Wheeler Zone"],
    tags: ["parking", "car", "bike", "vehicle", "park", "two-wheeler"],
    coordinates: { x: 180, y: 545 },
  },
  {
    id: "canteen",
    name: "Canteen",
    shortName: "Canteen",
    description: "Central food court with multiple cuisine options, comfortable seating and refreshment stalls.",
    category: "Facility",
    floor: "Ground Floor",
    facilities: ["Food Court", "Seating Area", "Juice Bar", "Snack Stalls", "Cafeteria"],
    tags: ["food", "canteen", "eat", "lunch", "breakfast", "dinner", "cafeteria", "juice", "snacks"],
    coordinates: { x: 550, y: 480 },
  },
  {
    id: "auditorium",
    name: "Auditorium",
    shortName: "Auditorium",
    description: "Main auditorium with 1200-seat capacity. Used for convocations, seminars, cultural events and guest lectures.",
    category: "Facility",
    floor: "Ground - 1st Floor",
    facilities: ["Main Hall", "Green Room", "Stage", "AV Control Room", "Foyer"],
    tags: ["auditorium", "events", "seminar", "convocation", "cultural", "stage", "hall", "lecture"],
    coordinates: { x: 900, y: 480 },
  },
  // ── Academic Blocks ───────────────────────────────────────────────────────
  {
    id: "cyber",
    name: "Cyber Block",
    shortName: "Cyber",
    description: "Computer Science and IT departments. Houses labs, lecture halls, and research centers.",
    category: "Academic",
    floor: "Ground - 3rd Floor",
    facilities: ["Computer Labs", "WiFi Zone", "Seminar Hall", "Server Room"],
    tags: ["cs", "it", "computers", "technology", "programming", "cyber", "coding"],
    coordinates: { x: 180, y: 160 },
  },
  {
    id: "hitech",
    name: "Hitech Block",
    shortName: "Hitech",
    description: "Advanced technology labs including robotics, electronics, and innovation hub.",
    category: "Academic",
    floor: "Ground - 2nd Floor",
    facilities: ["Robotics Lab", "Electronics Lab", "Innovation Hub", "3D Printing"],
    tags: ["robotics", "electronics", "innovation", "technology", "lab", "hitech", "hi-tech"],
    coordinates: { x: 550, y: 160 },
  },
  {
    id: "sjb",
    name: "SJB Block",
    shortName: "SJB",
    description: "Main academic block with classrooms, faculty offices, and administration.",
    category: "Academic",
    floor: "Ground - 4th Floor",
    facilities: ["Classrooms", "Faculty Offices", "Conference Rooms", "HOD Chambers"],
    tags: ["classes", "faculty", "lectures", "academic", "sjb", "classroom"],
    coordinates: { x: 900, y: 160 },
  },
  // ── Administrative ────────────────────────────────────────────────────────
  {
    id: "admission",
    name: "Admission Block",
    shortName: "Admission",
    description: "Student admissions office, counseling center, and administrative services.",
    category: "Administrative",
    floor: "Ground - 1st Floor",
    facilities: ["Admissions Office", "Counseling Center", "Records Room", "Fee Counter"],
    tags: ["admission", "enrollment", "admin", "office", "documents", "fees", "records"],
    coordinates: { x: 180, y: 340 },
  },
  {
    id: "digital",
    name: "Digital Block",
    shortName: "Digital",
    description: "Digital media, design studios and multimedia production labs.",
    category: "Academic",
    floor: "Ground - 2nd Floor",
    facilities: ["Media Studio", "Design Lab", "Editing Suite", "Photography Room"],
    tags: ["media", "design", "digital", "multimedia", "art", "studio", "photography"],
    coordinates: { x: 550, y: 340 },
  },
  {
    id: "chemical",
    name: "Chemical Block",
    shortName: "Chemical",
    description: "Chemistry and biotechnology laboratories with research facilities.",
    category: "Academic",
    floor: "Ground - 3rd Floor",
    facilities: ["Chem Labs", "Bio Lab", "Research Center", "Safety Station"],
    tags: ["chemistry", "biology", "science", "lab", "research", "chemical", "bio"],
    coordinates: { x: 900, y: 340 },
  },
];

// GET /api/search?q=query
router.get("/", (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();
  if (!query) return res.json({ results: locations, total: locations.length });

  const results = locations.filter((loc) =>
    loc.name.toLowerCase().includes(query) ||
    loc.shortName.toLowerCase().includes(query) ||
    loc.description.toLowerCase().includes(query) ||
    loc.category.toLowerCase().includes(query) ||
    loc.tags.some((tag) => tag.includes(query)) ||
    loc.facilities.some((f) => f.toLowerCase().includes(query))
  );

  res.json({ results, total: results.length, query });
});

// GET /api/search/categories
router.get("/categories", (req, res) => {
  const categories = [...new Set(locations.map((l) => l.category))];
  res.json({ categories });
});

const setupSearchRoutes = (app) => { app.use("/api/search", router); };
module.exports = setupSearchRoutes;
