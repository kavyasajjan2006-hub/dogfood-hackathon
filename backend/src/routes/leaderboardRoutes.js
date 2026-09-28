const express = require("express");

const {
    getLeaderboard
} = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/:hackathon_id", getLeaderboard);

module.exports = router;