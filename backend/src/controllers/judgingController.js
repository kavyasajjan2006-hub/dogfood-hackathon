const db = require("../config/database");

function getCriteria(req, res) {
    try {
        const { hackathon_id } = req.params;

        const criteria = db.prepare(`
            SELECT *
            FROM judging_criteria
            WHERE hackathon_id = ?
            ORDER BY display_order, id
        `).all(hackathon_id);

        res.json({
            success: true,
            criteria
        });
    } catch (error) {
        console.error("Get criteria error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch judging criteria"
        });
    }
}

function createCriteria(req, res) {
    try {
        const { hackathon_id } = req.params;
        const {
            name,
            description,
            max_score,
            weight,
            display_order
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Criteria name is required"
            });
        }

        const result = db.prepare(`
            INSERT INTO judging_criteria (
                hackathon_id,
                name,
                description,
                max_score,
                weight,
                display_order
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            hackathon_id,
            name,
            description || null,
            max_score || 25,
            weight || 1,
            display_order || 0
        );

        const criteria = db.prepare(`
            SELECT *
            FROM judging_criteria
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Judging criteria created",
            criteria
        });
    } catch (error) {
        console.error("Create criteria error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create judging criteria"
        });
    }
}

function assignJudge(req, res) {
    try {
        const { project_id } = req.params;
        const { judge_id } = req.body;

        if (!judge_id) {
            return res.status(400).json({
                success: false,
                message: "Judge ID is required"
            });
        }

        const judge = db.prepare(`
            SELECT id, name, email, role
            FROM users
            WHERE id = ?
        `).get(judge_id);

        if (!judge || judge.role !== "judge") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not a judge"
            });
        }

        const project = db.prepare(`
            SELECT id
            FROM projects
            WHERE id = ?
        `).get(project_id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const existing = db.prepare(`
            SELECT id
            FROM judge_assignments
            WHERE judge_id = ? AND project_id = ?
        `).get(judge_id, project_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Judge is already assigned to this project"
            });
        }

        const result = db.prepare(`
            INSERT INTO judge_assignments (
                judge_id,
                project_id
            )
            VALUES (?, ?)
        `).run(
            judge_id,
            project_id
        );

        res.status(201).json({
            success: true,
            message: "Judge assigned successfully",
            assignment_id: result.lastInsertRowid
        });
    } catch (error) {
        console.error("Assign judge error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to assign judge"
        });
    }
}

function getMyAssignments(req, res) {
    try {
        const assignments = db.prepare(`
            SELECT
                ja.id,
                ja.project_id,
                ja.status,
                ja.assigned_at,
                p.name AS project_name,
                p.description,
                p.technologies,
                p.repository_url,
                p.demo_url
            FROM judge_assignments ja
            JOIN projects p ON ja.project_id = p.id
            WHERE ja.judge_id = ?
            ORDER BY ja.assigned_at DESC
        `).all(req.user.id);

        res.json({
            success: true,
            assignments
        });
    } catch (error) {
        console.error("Get assignments error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch assignments"
        });
    }
}

function submitReview(req, res) {
    try {
        const { project_id } = req.params;
        const { scores, feedback } = req.body;

        if (!Array.isArray(scores) || scores.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Scores are required"
            });
        }

        const assignment = db.prepare(`
            SELECT *
            FROM judge_assignments
            WHERE judge_id = ? AND project_id = ?
        `).get(req.user.id, project_id);

        if (!assignment) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to this project"
            });
        }

        const criteria = db.prepare(`
            SELECT *
            FROM judging_criteria
            WHERE hackathon_id = (
                SELECT hackathon_id
                FROM projects
                WHERE id = ?
            )
        `).all(project_id);

        let totalScore = 0;

        for (const item of scores) {
            const criterion = criteria.find(
                criterion => criterion.id === Number(item.criterion_id)
            );

            if (!criterion) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid criterion: ${item.criterion_id}`
                });
            }

            const score = Number(item.score);

            if (
                Number.isNaN(score) ||
                score < 0 ||
                score > criterion.max_score
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid score for ${criterion.name}`
                });
            }

            totalScore += score;
        }

        const transaction = db.transaction(() => {
            const existingReview = db.prepare(`
                SELECT id
                FROM reviews
                WHERE project_id = ? AND judge_id = ?
            `).get(project_id, req.user.id);

            let reviewId;

            if (existingReview) {
                reviewId = existingReview.id;

                db.prepare(`
                    UPDATE reviews
                    SET total_score = ?,
                        feedback = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).run(
                    totalScore,
                    feedback || null,
                    reviewId
                );

                db.prepare(`
                    DELETE FROM review_scores
                    WHERE review_id = ?
                `).run(reviewId);
            } else {
                const result = db.prepare(`
                    INSERT INTO reviews (
                        project_id,
                        judge_id,
                        total_score,
                        feedback
                    )
                    VALUES (?, ?, ?, ?)
                `).run(
                    project_id,
                    req.user.id,
                    totalScore,
                    feedback || null
                );

                reviewId = result.lastInsertRowid;
            }

            const insertScore = db.prepare(`
                INSERT INTO review_scores (
                    review_id,
                    criterion_id,
                    score
                )
                VALUES (?, ?, ?)
            `);

            for (const item of scores) {
                insertScore.run(
                    reviewId,
                    item.criterion_id,
                    item.score
                );
            }

            db.prepare(`
                UPDATE judge_assignments
                SET status = 'completed'
                WHERE judge_id = ? AND project_id = ?
            `).run(
                req.user.id,
                project_id
            );
        });

        transaction();

        res.json({
            success: true,
            message: "Review submitted successfully",
            total_score: totalScore
        });
    } catch (error) {
        console.error("Submit review error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit review"
        });
    }
}

function getMyReviews(req, res) {
    try {
        const reviews = db.prepare(`
            SELECT
                r.id,
                r.project_id,
                p.name AS project_name,
                r.total_score,
                r.feedback,
                r.submitted_at,
                r.updated_at
            FROM reviews r
            JOIN projects p ON r.project_id = p.id
            WHERE r.judge_id = ?
            ORDER BY r.updated_at DESC
        `).all(req.user.id);

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error("Get reviews error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
}

module.exports = {
    getCriteria,
    createCriteria,
    assignJudge,
    getMyAssignments,
    submitReview,
    getMyReviews
};