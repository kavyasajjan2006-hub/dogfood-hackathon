const db = require("../config/database");

// GET ALL HACKATHONS
function getHackathons(req, res) {
    try {
        const hackathons = db.prepare(`
            SELECT *
            FROM hackathons
            ORDER BY created_at DESC
        `).all();

        res.json({
            success: true,
            hackathons
        });

    } catch (error) {
        console.error("Get hackathons error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch hackathons"
        });
    }
}


// GET SINGLE HACKATHON
function getHackathonById(req, res) {
    try {
        const { id } = req.params;

        const hackathon = db.prepare(`
            SELECT *
            FROM hackathons
            WHERE id = ?
        `).get(id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        const tracks = db.prepare(`
            SELECT *
            FROM tracks
            WHERE hackathon_id = ?
            ORDER BY id
        `).all(id);

        res.json({
            success: true,
            hackathon,
            tracks
        });

    } catch (error) {
        console.error("Get hackathon error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch hackathon"
        });
    }
}


// CREATE HACKATHON
function createHackathon(req, res) {
    try {
        const {
            name,
            description,
            start_date,
            end_date,
            submission_deadline
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Hackathon name is required"
            });
        }

        const result = db.prepare(`
            INSERT INTO hackathons
            (name, description, start_date, end_date, submission_deadline)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            name,
            description || null,
            start_date || null,
            end_date || null,
            submission_deadline || null
        );

        const hackathon = db.prepare(`
            SELECT *
            FROM hackathons
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Hackathon created",
            hackathon
        });

    } catch (error) {
        console.error("Create hackathon error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create hackathon"
        });
    }
}


// CREATE TRACK
function createTrack(req, res) {
    try {
        const { hackathon_id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Track name is required"
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
            INSERT INTO tracks
            (hackathon_id, name, description)
            VALUES (?, ?, ?)
        `).run(
            hackathon_id,
            name,
            description || null
        );

        const track = db.prepare(`
            SELECT *
            FROM tracks
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Track created",
            track
        });

    } catch (error) {
        console.error("Create track error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create track"
        });
    }
}


module.exports = {
    getHackathons,
    getHackathonById,
    createHackathon,
    createTrack
};