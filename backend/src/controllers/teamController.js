const db = require("../config/database");

function getTeams(req, res) {
    try {
        const teams = db.prepare(`
            SELECT
                t.*,
                h.name AS hackathon_name
            FROM teams t
            LEFT JOIN hackathons h ON t.hackathon_id = h.id
            ORDER BY t.created_at DESC
        `).all();

        res.json({
            success: true,
            teams
        });
    } catch (error) {
        console.error("Get teams error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch teams"
        });
    }
}

function getTeamById(req, res) {
    try {
        const { id } = req.params;

        const team = db.prepare(`
            SELECT
                t.*,
                h.name AS hackathon_name
            FROM teams t
            LEFT JOIN hackathons h ON t.hackathon_id = h.id
            WHERE t.id = ?
        `).get(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        const members = db.prepare(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                tm.joined_at
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE tm.team_id = ?
            ORDER BY tm.joined_at
        `).all(id);

        res.json({
            success: true,
            team,
            members
        });
    } catch (error) {
        console.error("Get team error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch team"
        });
    }
}

function createTeam(req, res) {
    try {
        const {
            hackathon_id,
            name
        } = req.body;

        if (!hackathon_id || !name) {
            return res.status(400).json({
                success: false,
                message: "Hackathon ID and team name are required"
            });
        }

        const hackathon = db.prepare(`
            SELECT id
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
            INSERT INTO teams (
                hackathon_id,
                name,
                created_by
            )
            VALUES (?, ?, ?)
        `).run(
            hackathon_id,
            name,
            req.user.id
        );

        db.prepare(`
            INSERT INTO team_members (
                team_id,
                user_id
            )
            VALUES (?, ?)
        `).run(
            result.lastInsertRowid,
            req.user.id
        );

        const team = db.prepare(`
            SELECT *
            FROM teams
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Team created successfully",
            team
        });
    } catch (error) {
        console.error("Create team error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create team"
        });
    }
}

function joinTeam(req, res) {
    try {
        const { id } = req.params;

        const team = db.prepare(`
            SELECT *
            FROM teams
            WHERE id = ?
        `).get(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        const existingMember = db.prepare(`
            SELECT id
            FROM team_members
            WHERE team_id = ? AND user_id = ?
        `).get(id, req.user.id);

        if (existingMember) {
            return res.status(409).json({
                success: false,
                message: "You are already a member of this team"
            });
        }

        db.prepare(`
            INSERT INTO team_members (
                team_id,
                user_id
            )
            VALUES (?, ?)
        `).run(
            id,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Joined team successfully"
        });
    } catch (error) {
        console.error("Join team error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to join team"
        });
    }
}

module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    joinTeam
};