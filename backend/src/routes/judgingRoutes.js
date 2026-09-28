const express = require("express");

const {
    getCriteria,
    createCriteria,
    assignJudge,
    getMyAssignments,
    submitReview,
    getMyReviews,
    getMyProgress
} = require("../controllers/judgingController");

const {
    authenticate,
    authorize
} = require("../middleware/auth");

const router = express.Router();

router.get(
    "/criteria/:hackathon_id",
    authenticate,
    getCriteria
);

router.post(
    "/criteria/:hackathon_id",
    authenticate,
    authorize("admin"),
    createCriteria
);

router.post(
    "/assign/:project_id",
    authenticate,
    authorize("admin"),
    assignJudge
);

router.get(
    "/my-assignments",
    authenticate,
    authorize("judge"),
    getMyAssignments
);

router.post(
    "/review/:project_id",
    authenticate,
    authorize("judge"),
    submitReview
);

router.get(
    "/my-reviews",
    authenticate,
    authorize("judge"),
    getMyReviews
);

// Judge progress dashboard
router.get(
    "/my-progress",
    authenticate,
    authorize("judge"),
    getMyProgress
);

module.exports = router;