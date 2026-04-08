const express = require("express");
const router = express.Router();

// Emergency contacts data
const emergencyContacts = [
  {
    id: 1,
    category: "Emergency Services",
    contacts: [
      {
        name: "Campus Security",
        phone: "+91-9876543210",
        description: "24/7 campus security and emergency response",
        icon: "🚨",
        priority: 1,
      },
      {
        name: "Medical Emergency",
        phone: "+91-9876543211",
        description: "Campus health center emergency line",
        icon: "🏥",
        priority: 1,
      },
      {
        name: "Fire Department",
        phone: "101",
        description: "Fire and rescue services",
        icon: "🚒",
        priority: 1,
      },
      {
        name: "Police",
        phone: "100",
        description: "Local police emergency hotline",
        icon: "👮",
        priority: 1,
      },
      {
        name: "Ambulance",
        phone: "108",
        description: "Emergency medical services",
        icon: "🚑",
        priority: 1,
      },
    ],
  },
  {
    id: 2,
    category: "Campus Support",
    contacts: [
      {
        name: "Dean of Students",
        phone: "+91-9876543212",
        description: "Student affairs and welfare",
        icon: "👔",
        priority: 2,
      },
      {
        name: "Counseling Center",
        phone: "+91-9876543213",
        description: "Mental health and counseling support",
        icon: "💭",
        priority: 2,
      },
      {
        name: "Hostel Warden",
        phone: "+91-9876543214",
        description: "Hostel emergency and support",
        icon: "🏠",
        priority: 2,
      },
      {
        name: "Transport Office",
        phone: "+91-9876543215",
        description: "Campus transport and vehicle assistance",
        icon: "🚌",
        priority: 2,
      },
    ],
  },
  {
    id: 3,
    category: "Facilities",
    contacts: [
      {
        name: "Maintenance",
        phone: "+91-9876543216",
        description: "Building and infrastructure issues",
        icon: "🔧",
        priority: 3,
      },
      {
        name: "IT Help Desk",
        phone: "+91-9876543217",
        description: "Technical support and network issues",
        icon: "💻",
        priority: 3,
      },
      {
        name: "Library",
        phone: "+91-9876543218",
        description: "Library assistance and resources",
        icon: "📚",
        priority: 3,
      },
    ],
  },
];

// Safety tips data
const safetyTips = [
  {
    id: 1,
    title: "Fire Safety",
    tips: [
      "Know the location of fire extinguishers and emergency exits",
      "Never use elevators during a fire emergency",
      "If caught in smoke, stay low and crawl to safety",
      "Alert others and evacuate immediately",
    ],
  },
  {
    id: 2,
    title: "Medical Emergency",
    tips: [
      "Call campus medical emergency line immediately",
      "Stay with the person until help arrives",
      "Do not move an injured person unless in immediate danger",
      "Provide first aid only if trained",
    ],
  },
  {
    id: 3,
    title: "Personal Safety",
    tips: [
      "Always carry your student ID card",
      "Use well-lit paths when walking at night",
      "Share your location with friends when going out",
      "Report suspicious activity to campus security",
    ],
  },
  {
    id: 4,
    title: "Natural Disasters",
    tips: [
      "Know your building's emergency assembly point",
      "During earthquakes: Drop, Cover, and Hold On",
      "Stay away from windows during storms",
      "Follow official evacuation routes",
    ],
  },
];

// GET /api/emergency/contacts
router.get("/contacts", (req, res) => {
  res.json({ contacts: emergencyContacts, total: emergencyContacts.length });
});

// GET /api/emergency/safety-tips
router.get("/safety-tips", (req, res) => {
  res.json({ tips: safetyTips, total: safetyTips.length });
});

// GET /api/emergency/all
router.get("/all", (req, res) => {
  res.json({
    contacts: emergencyContacts,
    safetyTips: safetyTips,
  });
});

const setupEmergencyRoutes = (app) => {
  app.use("/api/emergency", router);
};

module.exports = setupEmergencyRoutes;