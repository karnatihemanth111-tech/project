const express = require("express");
const router = express.Router();

// Static events data (replace with DB in production)
const events = [
  {
    id: 1,
    title: "Tech Fest 2025",
    description: "Annual technology festival with coding competitions, robotics showcase, and guest lectures from industry leaders.",
    category: "Technical",
    date: "2025-04-15",
    time: "09:00 AM",
    endTime: "06:00 PM",
    location: "Cyber Block",
    locationId: "cyber",
    organizer: "CS Department",
    image: null,
    tags: ["coding", "robotics", "hackathon"],
    registrationOpen: true,
    maxAttendees: 500,
    currentAttendees: 320,
    featured: true,
  },
  {
    id: 2,
    title: "Cultural Night",
    description: "A vibrant evening celebrating diverse cultures with music, dance performances, and art exhibitions.",
    category: "Cultural",
    date: "2025-04-20",
    time: "05:00 PM",
    endTime: "09:00 PM",
    location: "SJB Block Auditorium",
    locationId: "sjb",
    organizer: "Student Union",
    image: null,
    tags: ["music", "dance", "art", "culture"],
    registrationOpen: true,
    maxAttendees: 800,
    currentAttendees: 450,
    featured: true,
  },
  {
    id: 3,
    title: "Digital Design Workshop",
    description: "Hands-on workshop on UI/UX design principles, Figma, and modern web design trends.",
    category: "Workshop",
    date: "2025-04-10",
    time: "10:00 AM",
    endTime: "01:00 PM",
    location: "Digital Block",
    locationId: "digital",
    organizer: "Design Club",
    image: null,
    tags: ["design", "ui/ux", "figma", "web"],
    registrationOpen: true,
    maxAttendees: 60,
    currentAttendees: 48,
    featured: false,
  },
  {
    id: 4,
    title: "Chemistry Research Symposium",
    description: "Research presentations by students and faculty on latest developments in applied chemistry and biotech.",
    category: "Academic",
    date: "2025-04-12",
    time: "11:00 AM",
    endTime: "03:00 PM",
    location: "Chemical Block",
    locationId: "chemical",
    organizer: "Chemistry Dept",
    image: null,
    tags: ["research", "chemistry", "biotech", "science"],
    registrationOpen: false,
    maxAttendees: 150,
    currentAttendees: 150,
    featured: false,
  },
  {
    id: 5,
    title: "Robotics Club Meetup",
    description: "Weekly meetup for robotics enthusiasts. Showcase your builds, share ideas, and collaborate on projects.",
    category: "Club",
    date: "2025-04-08",
    time: "03:00 PM",
    endTime: "05:00 PM",
    location: "Hi-Tech Block",
    locationId: "hitech",
    organizer: "Robotics Club",
    image: null,
    tags: ["robotics", "club", "project", "hardware"],
    registrationOpen: true,
    maxAttendees: 40,
    currentAttendees: 22,
    featured: false,
  },
  {
    id: 6,
    title: "Campus Admission Open Day",
    description: "Open day for prospective students and parents to explore the campus, meet faculty, and learn about programs.",
    category: "Administrative",
    date: "2025-04-25",
    time: "09:00 AM",
    endTime: "04:00 PM",
    location: "Admission Block",
    locationId: "admission",
    organizer: "Admissions Office",
    image: null,
    tags: ["admission", "open day", "campus tour"],
    registrationOpen: true,
    maxAttendees: 300,
    currentAttendees: 120,
    featured: false,
  },
];

// GET /api/events
router.get("/", (req, res) => {
  const { category, featured, q } = req.query;
  let filtered = [...events];

  if (category && category !== "All") {
    filtered = filtered.filter(
      (e) => e.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (featured === "true") {
    filtered = filtered.filter((e) => e.featured);
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.tags.some((t) => t.includes(query))
    );
  }

  // Sort by date
  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json({ events: filtered, total: filtered.length });
});

// GET /api/events/:id
router.get("/:id", (req, res) => {
  const event = events.find((e) => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

// GET /api/events/categories/list
router.get("/categories/list", (req, res) => {
  const categories = ["All", ...new Set(events.map((e) => e.category))];
  res.json({ categories });
});

const setupEventsRoutes = (app) => {
  app.use("/api/events", router);
};

module.exports = setupEventsRoutes;
