const db = require("../config/database");

function getLeaderboard(req, res) {
    try {
        const { hackathon_id } = req.params;

        const leaderboard = db.prepare(`
            SELECT
                p.id AS project_id,
                p.name AS project_name,
                tm.name AS team_name,
                COUNT(DISTINCT r.judge_id) AS judges_count,
                ROUND(AVG(r.total_score), 2) AS average_score,
                ROUND(MAX(r.total_score), 2) AS highest_score
            FROM projects p
            LEFT JOIN teams tm
                ON p.team_id = tm.id
            LEFT JOIN reviews r
                ON p.id = r.project_id
            WHERE p.hackathon_id = ?
              AND p.status = 'submitted'
            GROUP BY
                p.id,
                p.name,
                tm.name
            ORDER BY average_score DESC;
        `).all(hackathon_id);

        const rankedLeaderboard = leaderboard.map((project, index) => ({
            rank: index + 1,
            ...project
        }));

        res.json({
            success: true,
            leaderboard: rankedLeaderboard
        });

    } catch (error) {
        console.error("Leaderboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate leaderboard"
        });
    }
}

module.exports = {
    getLeaderboard
};