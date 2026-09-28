const bcrypt = require("bcryptjs");
const db = require("./config/database");

console.log("Starting Dogfood seed...");

try {
    const seed = db.transaction(() => {

        // ============================================
        // 1. USERS
        // ============================================

        const users = [
            {
                name: "Admin User",
                email: "admin@dogfood.local",
                password: "admin123",
                role: "admin"
            },
            {
                name: "Judge User",
                email: "judge@dogfood.local",
                password: "judge123",
                role: "judge"
            },
            {
                name: "Test Participant",
                email: "participant@dogfood.local",
                password: "participant123",
                role: "participant"
            },
            {
                name: "Second Judge",
                email: "judge2@dogfood.local",
                password: "judge2123",
                role: "judge"
            }
        ];

        const userIds = {};

        for (const user of users) {
            let existing = db
                .prepare("SELECT id FROM users WHERE email = ?")
                .get(user.email);

            if (existing) {
                userIds[user.email] = existing.id;
                console.log(`User already exists: ${user.email}`);
                continue;
            }

            const hashedPassword = bcrypt.hashSync(user.password, 10);

            const result = db.prepare(`
                INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, ?)
            `).run(
                user.name,
                user.email,
                hashedPassword,
                user.role
            );

            userIds[user.email] = result.lastInsertRowid;

            console.log(`Created ${user.role}: ${user.email}`);
        }

        // ============================================
        // 2. HACKATHON
        // ============================================

        let hackathon = db
            .prepare("SELECT id FROM hackathons WHERE name = ?")
            .get("Dogfood Hackathon 2026");

        let hackathonId;

        if (hackathon) {
            hackathonId = hackathon.id;
            console.log("Hackathon already exists");
        } else {
            const result = db.prepare(`
                INSERT INTO hackathons
                (name, description, start_date, end_date, submission_deadline, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(
                "Dogfood Hackathon 2026",
                "A self-hostable hackathon platform that judges itself.",
                "2026-09-01 09:00:00",
                "2026-09-30 23:59:59",
                "2026-09-30 23:30:00",
                "active"
            );

            hackathonId = result.lastInsertRowid;

            console.log(`Created hackathon: ${hackathonId}`);
        }

        // ============================================
        // 3. TRACK
        // ============================================

        let track = db.prepare(`
            SELECT id
            FROM tracks
            WHERE hackathon_id = ? AND name = ?
        `).get(hackathonId, "Open Innovation");

        let trackId;

        if (track) {
            trackId = track.id;
            console.log("Track already exists");
        } else {
            const result = db.prepare(`
                INSERT INTO tracks
                (hackathon_id, name, description)
                VALUES (?, ?, ?)
            `).run(
                hackathonId,
                "Open Innovation",
                "Build an innovative solution to a real-world problem."
            );

            trackId = result.lastInsertRowid;

            console.log(`Created track: ${trackId}`);
        }

        // ============================================
        // 4. TEAM
        // ============================================

        let team = db.prepare(`
            SELECT id
            FROM teams
            WHERE hackathon_id = ? AND name = ?
        `).get(hackathonId, "Team Dogfood");

        let teamId;

        if (team) {
            teamId = team.id;
            console.log("Team already exists");
        } else {
            const result = db.prepare(`
                INSERT INTO teams
                (hackathon_id, name, created_by)
                VALUES (?, ?, ?)
            `).run(
                hackathonId,
                "Team Dogfood",
                userIds["participant@dogfood.local"]
            );

            teamId = result.lastInsertRowid;

            console.log(`Created team: ${teamId}`);
        }

        // ============================================
        // 5. TEAM MEMBER
        // ============================================

        const participantId = userIds["participant@dogfood.local"];

        const teamMember = db.prepare(`
            SELECT id
            FROM team_members
            WHERE team_id = ? AND user_id = ?
        `).get(teamId, participantId);

        if (!teamMember) {
            db.prepare(`
                INSERT INTO team_members
                (team_id, user_id)
                VALUES (?, ?)
            `).run(teamId, participantId);

            console.log("Added participant to team");
        }

        // ============================================
        // 6. PROJECT
        // ============================================

        let project = db.prepare(`
            SELECT id
            FROM projects
            WHERE hackathon_id = ? AND name = ?
        `).get(hackathonId, "Dogfood Platform");

        let projectId;

        if (project) {
            projectId = project.id;
            console.log("Project already exists");
        } else {
            const result = db.prepare(`
                INSERT INTO projects
                (
                    hackathon_id,
                    track_id,
                    team_id,
                    name,
                    description,
                    technologies,
                    repository_url,
                    demo_url,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                hackathonId,
                trackId,
                teamId,
                "Dogfood Platform",
                "An open-source self-hostable hackathon platform designed to manage participants, projects, judging, scoring, and results.",
                "React, Node.js, Express, SQLite, Docker",
                "https://github.com/kavyasajjan2006-hub/dogfood-hackathon",
                "http://localhost:3000",
                "submitted"
            );

            projectId = result.lastInsertRowid;

            console.log(`Created project: ${projectId}`);
        }

        // ============================================
        // 7. SUBMISSION
        // ============================================

        const submission = db.prepare(`
            SELECT id
            FROM submissions
            WHERE project_id = ?
        `).get(projectId);

        if (!submission) {
            db.prepare(`
                INSERT INTO submissions
                (project_id, submitted_by, status)
                VALUES (?, ?, ?)
            `).run(
                projectId,
                participantId,
                "submitted"
            );

            console.log("Created project submission");
        }

        // ============================================
        // 8. JUDGING CRITERIA
        // ============================================

        const criteria = [
            {
                name: "Innovation",
                description: "Originality and creativity of the solution.",
                max_score: 25,
                weight: 1
            },
            {
                name: "Technical Implementation",
                description: "Quality and completeness of the technical implementation.",
                max_score: 25,
                weight: 1
            },
            {
                name: "Impact",
                description: "Potential usefulness and real-world impact.",
                max_score: 25,
                weight: 1
            },
            {
                name: "Presentation",
                description: "Clarity and effectiveness of the project presentation.",
                max_score: 25,
                weight: 1
            }
        ];

        const criterionIds = [];

        for (let i = 0; i < criteria.length; i++) {
            const criterion = criteria[i];

            let existing = db.prepare(`
                SELECT id
                FROM judging_criteria
                WHERE hackathon_id = ? AND name = ?
            `).get(hackathonId, criterion.name);

            let criterionId;

            if (existing) {
                criterionId = existing.id;
            } else {
                const result = db.prepare(`
                    INSERT INTO judging_criteria
                    (
                        hackathon_id,
                        name,
                        description,
                        max_score,
                        weight,
                        display_order
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `).run(
                    hackathonId,
                    criterion.name,
                    criterion.description,
                    criterion.max_score,
                    criterion.weight,
                    i + 1
                );

                criterionId = result.lastInsertRowid;
            }

            criterionIds.push(criterionId);
        }

        console.log("Judging criteria ready");

        // ============================================
        // 9. JUDGE ASSIGNMENTS
        // ============================================

        const judge1Id = userIds["judge@dogfood.local"];
        const judge2Id = userIds["judge2@dogfood.local"];

        const judges = [judge1Id, judge2Id];

        for (const judgeId of judges) {
            const assignment = db.prepare(`
                SELECT id
                FROM judge_assignments
                WHERE judge_id = ? AND project_id = ?
            `).get(judgeId, projectId);

            if (!assignment) {
                db.prepare(`
                    INSERT INTO judge_assignments
                    (judge_id, project_id, status)
                    VALUES (?, ?, ?)
                `).run(
                    judgeId,
                    projectId,
                    "completed"
                );

                console.log(`Assigned project to judge ${judgeId}`);
            }
        }

        // ============================================
        // 10. REVIEWS
        // ============================================

        const reviews = [
            {
                judgeId: judge1Id,
                scores: [22, 24, 23, 21],
                feedback: "Strong implementation with a clear hackathon workflow."
            },
            {
                judgeId: judge2Id,
                scores: [20, 22, 21, 23],
                feedback: "Good overall solution with useful judging and project management features."
            }
        ];

        for (const reviewData of reviews) {

            const existingReview = db.prepare(`
                SELECT id
                FROM reviews
                WHERE project_id = ? AND judge_id = ?
            `).get(projectId, reviewData.judgeId);

            if (existingReview) {
                console.log(`Review already exists for judge ${reviewData.judgeId}`);
                continue;
            }

            const totalScore = reviewData.scores.reduce(
                (sum, score) => sum + score,
                0
            );

            const reviewResult = db.prepare(`
                INSERT INTO reviews
                (
                    project_id,
                    judge_id,
                    total_score,
                    feedback
                )
                VALUES (?, ?, ?, ?)
            `).run(
                projectId,
                reviewData.judgeId,
                totalScore,
                reviewData.feedback
            );

            const reviewId = reviewResult.lastInsertRowid;

            for (let i = 0; i < criterionIds.length; i++) {
                db.prepare(`
                    INSERT INTO review_scores
                    (
                        review_id,
                        criterion_id,
                        score
                    )
                    VALUES (?, ?, ?)
                `).run(
                    reviewId,
                    criterionIds[i],
                    reviewData.scores[i]
                );
            }

            console.log(`Created review for judge ${reviewData.judgeId}`);
        }

        console.log("============================================");
        console.log("Dogfood seed data ready");
        console.log("============================================");
        console.log("Admin:       admin@dogfood.local / admin123");
        console.log("Judge 1:     judge@dogfood.local / judge123");
        console.log("Judge 2:     judge2@dogfood.local / judge2123");
        console.log("Participant: participant@dogfood.local / participant123");
        console.log("Hackathon:   Dogfood Hackathon 2026");
        console.log("Project:     Dogfood Platform");
        console.log("============================================");
    });

    seed();

} catch (error) {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
}