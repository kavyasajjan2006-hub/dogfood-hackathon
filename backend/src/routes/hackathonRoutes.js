const express = require("express");

const {
    getHackathons,
    getHackathonById,
    createHackathon,
    createTrack
} = require("../controllers/hackathonController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/", getHackathons);
router.get("/:id", getHackathonById);

// Admin only
router.post(
    "/",
    authenticate,
    authorize("admin"),
    createHackathon
);

router.post(
    "/:hackathon_id/tracks",
    authenticate,
    authorize("admin"),
    createTrack
);

module.exports = router;