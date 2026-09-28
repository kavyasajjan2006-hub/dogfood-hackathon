const db = require("../config/database");

function exportLeaderboardCSV(req, res) {
    try {
        const { hackathon_id } = req.params;

        const hackathon = db.prepare(`
            SELECT id, name
            FROM hackathons
            WHERE id = ?
        `).get(hackathon_id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        const rows = db.prepare(`
            SELECT
                p.id AS project_id,
                p.name AS project_name,
                tm.name AS team_name,
                COUNT(DISTINCT r.judge_id) AS judges_count,
                ROUND(AVG(r.total_score), 2) AS average_score
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
            ORDER BY average_score DESC
        `).all(hackathon_id);

        const headers = [
            "Rank",
            "Project ID",
            "Project Name",
            "Team Name",
            "Judges Count",
            "Average Score"
        ];

        const csvRows = rows.map((row, index) => [
            index + 1,
            row.project_id,
            row.project_name,
            row.team_name || "",
            row.judges_count,
            row.average_score || 0
        ]);

        const csv = [
            headers,
            ...csvRows
        ]
            .map(row =>
                row
                    .map(value => `"${String(value).replace(/"/g, '""')}"`)
                    .join(",")
            )
            .join("\n");

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${hackathon.name.replace(/[^a-z0-9]/gi, "_")}_leaderboard.csv"`
        );

        res.send(csv);

    } catch (error) {
        console.error("CSV export error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to export leaderboard"
        });
    }
}

module.exports = {
    exportLeaderboardCSV
};