const express = require("express");

const {
    getProjects,
    getProjectById,
    createProject,
    submitProject
} = require("../controllers/projectController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.post(
    "/",
    authenticate,
    authorize("participant", "admin"),
    createProject
);

router.post(
    "/:id/submit",
    authenticate,
    authorize("participant", "admin"),
    submitProject
);

module.exports = router;