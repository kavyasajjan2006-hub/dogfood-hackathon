const express = require("express");
const cors = require("cors");

const db = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const judgingRoutes = require("./routes/judgingRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Dogfood Hackathon backend is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/judging", judgingRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/export", exportRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});