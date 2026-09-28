const db = require("../config/database");

function getProjects(req, res) {
    try {
        const projects = db.prepare(`
            SELECT
                p.*,
                h.name AS hackathon_name,
                t.name AS track_name,
                tm.name AS team_name
            FROM projects p
            LEFT JOIN hackathons h ON p.hackathon_id = h.id
            LEFT JOIN tracks t ON p.track_id = t.id
            LEFT JOIN teams tm ON p.team_id = tm.id
            ORDER BY p.created_at DESC
        `).all();

        res.json({
            success: true,
            projects
        });
    } catch (error) {
        console.error("Get projects error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        });
    }
}


function getProjectById(req, res) {
    try {
        const { id } = req.params;

        const project = db.prepare(`
            SELECT
                p.*,
                h.name AS hackathon_name,
                t.name AS track_name,
                tm.name AS team_name
            FROM projects p
            LEFT JOIN hackathons h ON p.hackathon_id = h.id
            LEFT JOIN tracks t ON p.track_id = t.id
            LEFT JOIN teams tm ON p.team_id = tm.id
            WHERE p.id = ?
        `).get(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.json({
            success: true,
            project
        });
    } catch (error) {
        console.error("Get project error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch project"
        });
    }
}


function createProject(req, res) {
    try {
        const {
            hackathon_id,
            track_id,
            team_id,
            name,
            description,
            technologies,
            repository_url,
            demo_url
        } = req.body;

        if (!hackathon_id || !name) {
            return res.status(400).json({
                success: false,
                message: "Hackathon ID and project name are required"
            });
        }

        const hackathon = db.prepare(`
            SELECT *
            FROM hackathons
            WHERE id = ?
        `).get(hackathon_id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        const result = db.prepare(`
            INSERT INTO projects (
                hackathon_id,
                track_id,
                team_id,
                name,
                description,
                technologies,
                repository_url,
                demo_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            hackathon_id,
            track_id || null,
            team_id || null,
            name,
            description || null,
            technologies || null,
            repository_url || null,
            demo_url || null
        );

        const project = db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Project created",
            project
        });
    } catch (error) {
        console.error("Create project error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create project"
        });
    }
}


function submitProject(req, res) {
    try {
        const { id } = req.params;

        const project = db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const hackathon = db.prepare(`
            SELECT *
            FROM hackathons
            WHERE id = ?
        `).get(project.hackathon_id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        if (hackathon.status === "closed") {
            return res.status(400).json({
                success: false,
                message: "Submission is closed for this hackathon"
            });
        }

        if (
            hackathon.submission_deadline &&
            new Date() > new Date(hackathon.submission_deadline)
        ) {
            return res.status(400).json({
                success: false,
                message: "Submission deadline has passed"
            });
        }

        db.prepare(`
            UPDATE projects
            SET status = 'submitted',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(id);

        db.prepare(`
            INSERT INTO submissions (
                project_id,
                submitted_by
            )
            VALUES (?, ?)
            ON CONFLICT(project_id)
            DO UPDATE SET
                submitted_by = excluded.submitted_by,
                submitted_at = CURRENT_TIMESTAMP,
                status = 'submitted'
        `).run(id, req.user.id);

        const updatedProject = db.prepare(`
            SELECT *
            FROM projects
            WHERE id = ?
        `).get(id);

        res.json({
            success: true,
            message: "Project submitted successfully",
            project: updatedProject
        });
    } catch (error) {
        console.error("Submit project error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit project"
        });
    }
}


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    submitProject
};