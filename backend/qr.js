// backend/qr.js
const locations = {
  "CAMPUS:Main Gate": {
    name: "Main Gate",
    description: "Main campus entrance. Security check-post and visitor registration.",
    type: "Entry Point",
    floor: "Ground Level",
    hours: "24 / 7",
    contact: "security@campus.edu",
  },
  "CAMPUS:Parking": {
    name: "Parking",
    description: "Vehicle parking area for students, staff and visitors.",
    type: "Facility",
    floor: "Ground Level",
    hours: "6:00 AM – 10:00 PM",
    contact: "facility@campus.edu",
  },
  "CAMPUS:Canteen": {
    name: "Canteen",
    description: "Central food court with multiple cuisine options and refreshment stalls.",
    type: "Dining",
    floor: "Ground Floor",
    hours: "7:30 AM – 9:00 PM",
    contact: "canteen@campus.edu",
  },
  "CAMPUS:Auditorium": {
    name: "Auditorium",
    description: "1200-seat auditorium for events, seminars and convocations.",
    type: "Event Venue",
    floor: "Ground - 1st Floor",
    hours: "9:00 AM – 8:00 PM",
    contact: "events@campus.edu",
  },
  "CAMPUS:Cyber Block": {
    name: "Cyber Block",
    description: "Main computer science and IT department building.",
    type: "Academic Block",
    floor: "Ground - 3rd",
    hours: "8:00 AM – 6:00 PM",
    contact: "cyber@campus.edu",
  },
  "CAMPUS:Hitech Block": {
    name: "Hitech Block",
    description: "Electronics and advanced technology labs.",
    type: "Academic Block",
    floor: "Ground - 2nd",
    hours: "8:00 AM – 6:00 PM",
    contact: "hitech@campus.edu",
  },
  "CAMPUS:SJB Block": {
    name: "SJB Block",
    description: "Main administrative and faculty offices.",
    type: "Admin Block",
    floor: "Ground - 4th",
    hours: "9:00 AM – 5:00 PM",
    contact: "admin@campus.edu",
  },
  "CAMPUS:Admission Block": {
    name: "Admission Block",
    description: "Admissions, registrar and student services.",
    type: "Admin Block",
    floor: "Ground - 1st",
    hours: "9:00 AM – 4:00 PM",
    contact: "admissions@campus.edu",
  },
  "CAMPUS:Digital Block": {
    name: "Digital Block",
    description: "Digital media, design studios and multimedia labs.",
    type: "Academic Block",
    floor: "Ground - 2nd",
    hours: "8:00 AM – 6:00 PM",
    contact: "digital@campus.edu",
  },
  "CAMPUS:Chemical Block": {
    name: "Chemical Block",
    description: "Chemistry and applied sciences laboratories.",
    type: "Lab Block",
    floor: "Ground - 3rd",
    hours: "8:00 AM – 5:00 PM",
    contact: "chem@campus.edu",
  },
};

function setupQrRoutes(app) {
  app.post("/api/qr/validate", (req, res) => {
    const { code } = req.body;
    if (!code)
      return res.status(400).json({ success: false, message: "No QR code provided." });

    const location = locations[code];
    if (!location)
      return res.status(404).json({
        success: false,
        message: "Unknown QR code. Doesn't match any campus location.",
      });

    return res.json({ success: true, location });
  });
}

module.exports = setupQrRoutes;
