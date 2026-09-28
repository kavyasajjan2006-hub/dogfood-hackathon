
-- 1. USERS


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    role TEXT NOT NULL DEFAULT 'participant'
        CHECK (role IN ('participant', 'judge', 'admin')),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);



-- 2. HACKATHONS

CREATE TABLE IF NOT EXISTS hackathons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    description TEXT,

    start_date DATETIME,

    end_date DATETIME,

    submission_deadline DATETIME,

    status TEXT NOT NULL DEFAULT 'upcoming'
        CHECK (status IN ('upcoming', 'active', 'closed')),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 3. TRACKS
-- ============================================

CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    hackathon_id INTEGER NOT NULL,

    name TEXT NOT NULL,

    description TEXT,

    FOREIGN KEY (hackathon_id)
        REFERENCES hackathons(id)
        ON DELETE CASCADE
);



-- 4. TEAMS

CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    hackathon_id INTEGER NOT NULL,

    name TEXT NOT NULL,

    created_by INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (hackathon_id)
        REFERENCES hackathons(id)
        ON DELETE CASCADE,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);



-- 5. TEAM MEMBERS


CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    team_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,

    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE(team_id, user_id)
);



-- 6. PROJECTS


CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    hackathon_id INTEGER NOT NULL,

    track_id INTEGER,

    team_id INTEGER,

    name TEXT NOT NULL,

    description TEXT,

    technologies TEXT,

    repository_url TEXT,

    demo_url TEXT,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'withdrawn')),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (hackathon_id)
        REFERENCES hackathons(id)
        ON DELETE CASCADE,

    FOREIGN KEY (track_id)
        REFERENCES tracks(id)
        ON DELETE SET NULL,

    FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE SET NULL
);



-- 7. SUBMISSIONS

CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    project_id INTEGER NOT NULL,

    submitted_by INTEGER,

    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    status TEXT NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'accepted', 'rejected')),

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (submitted_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    UNIQUE(project_id)
);



-- 8. JUDGING CRITERIA


CREATE TABLE IF NOT EXISTS judging_criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    hackathon_id INTEGER NOT NULL,

    name TEXT NOT NULL,

    description TEXT,

    max_score INTEGER NOT NULL DEFAULT 25,

    weight REAL NOT NULL DEFAULT 1.0,

    display_order INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (hackathon_id)
        REFERENCES hackathons(id)
        ON DELETE CASCADE
);



-- 9. JUDGE ASSIGNMENTS


CREATE TABLE IF NOT EXISTS judge_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    judge_id INTEGER NOT NULL,

    project_id INTEGER NOT NULL,

    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'completed')),

    FOREIGN KEY (judge_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    UNIQUE(judge_id, project_id)
);


-- 10. REVIEWS


CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    project_id INTEGER NOT NULL,

    judge_id INTEGER NOT NULL,

    total_score REAL NOT NULL DEFAULT 0,

    feedback TEXT,

    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (judge_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE(project_id, judge_id)
);



-- 11. REVIEW SCORES


CREATE TABLE IF NOT EXISTS review_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    review_id INTEGER NOT NULL,

    criterion_id INTEGER NOT NULL,

    score REAL NOT NULL,

    FOREIGN KEY (review_id)
        REFERENCES reviews(id)
        ON DELETE CASCADE,

    FOREIGN KEY (criterion_id)
        REFERENCES judging_criteria(id)
        ON DELETE CASCADE,

    UNIQUE(review_id, criterion_id)
);



-- 12. INDEXES


CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_hackathons_status
ON hackathons(status);

CREATE INDEX IF NOT EXISTS idx_tracks_hackathon
ON tracks(hackathon_id);

CREATE INDEX IF NOT EXISTS idx_teams_hackathon
ON teams(hackathon_id);

CREATE INDEX IF NOT EXISTS idx_team_members_user
ON team_members(user_id);

CREATE INDEX IF NOT EXISTS idx_projects_hackathon
ON projects(hackathon_id);

CREATE INDEX IF NOT EXISTS idx_projects_team
ON projects(team_id);

CREATE INDEX IF NOT EXISTS idx_projects_status
ON projects(status);

CREATE INDEX IF NOT EXISTS idx_submissions_project
ON submissions(project_id);

CREATE INDEX IF NOT EXISTS idx_judge_assignments_judge
ON judge_assignments(judge_id);

CREATE INDEX IF NOT EXISTS idx_judge_assignments_project
ON judge_assignments(project_id);

CREATE INDEX IF NOT EXISTS idx_reviews_project
ON reviews(project_id);

CREATE INDEX IF NOT EXISTS idx_reviews_judge
ON reviews(judge_id);

CREATE INDEX IF NOT EXISTS idx_review_scores_review
ON review_scores(review_id);