const express = require("express");
const cors = require("cors");
const setupSearchRoutes = require("./search");
const setupEventsRoutes = require("./events");
const setupQrRoutes = require("./qr");
const setupEmergencyRoutes = require("./emergency");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
setupSearchRoutes(app);
setupEventsRoutes(app);
setupQrRoutes(app);
setupEmergencyRoutes(app);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Campus Nav API is running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});