const express = require("express");

const {
    getTeams,
    getTeamById,
    createTeam,
    joinTeam
} = require("../controllers/teamController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.get("/", getTeams);

router.get("/:id", getTeamById);

router.post(
    "/",
    authenticate,
    authorize("participant", "admin"),
    createTeam
);

router.post(
    "/:id/join",
    authenticate,
    authorize("participant", "admin"),
    joinTeam
);

module.exports = router;