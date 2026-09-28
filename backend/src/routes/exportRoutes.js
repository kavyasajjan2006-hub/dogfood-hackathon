const express = require("express");

const {
    exportLeaderboardCSV
} = require("../controllers/exportController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.get(
    "/leaderboard/:hackathon_id",
    authenticate,
    authorize("admin"),
    exportLeaderboardCSV
);

module.exports = router;