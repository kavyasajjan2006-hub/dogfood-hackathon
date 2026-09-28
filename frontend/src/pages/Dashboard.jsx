import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  FolderKanban,
  Trophy,
  ClipboardCheck,
  Medal,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  Users,
} from "lucide-react";

import { getProjects } from "../utils/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const activePage = location.state?.active || "Overview";

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);

      const data = await getProjects();

      const list = Array.isArray(data)
        ? data
        : data?.projects || data?.data || [];

      setProjects(list);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((project) => {
    const text = `
      ${project.name || ""}
      ${project.project_name || ""}
      ${project.team_name || ""}
      ${project.description || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const submittedProjects = projects.filter(
    (project) =>
      project.status === "submitted" ||
      project.submitted === 1 ||
      project.submitted === true
  );

  function navigateTo(path, name) {
    navigate(path, {
      state: {
        active: name,
      },
    });
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">

        {/* ================= SIDEBAR ================= */}

        <aside className="dashboard-sidebar">

          <div className="sidebar-logo">
            <h2>
              Hack<span>Hub</span>
            </h2>
          </div>

          <nav className="sidebar-menu">

            <button
              className={activePage === "Overview" ? "active" : ""}
              onClick={() => navigateTo("/dashboard", "Overview")}
            >
              <FolderKanban />
              <span>Overview</span>
            </button>

            <button
              className={activePage === "Hackathons" ? "active" : ""}
              onClick={() => navigateTo("/dashboard", "Hackathons")}
            >
              <Trophy />
              <span>Hackathons</span>
            </button>

            <button
              className={activePage === "Projects" ? "active" : ""}
              onClick={() => navigateTo("/projects", "Projects")}
            >
              <FolderKanban />
              <span>Projects</span>
            </button>

            <button
              className={activePage === "Judging" ? "active" : ""}
              onClick={() => navigateTo("/judging", "Judging")}
            >
              <ClipboardCheck />
              <span>Judging</span>
            </button>

            <button
              className={activePage === "Leaderboard" ? "active" : ""}
              onClick={() => navigateTo("/leaderboard", "Leaderboard")}
            >
              <Medal />
              <span>Leaderboard</span>
            </button>

          </nav>
        </aside>

        {/* ================= MAIN ================= */}

        <main className="dashboard-main">

          {/* TOP BAR */}

          <header className="dashboard-topbar">

            <div className="dashboard-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="dashboard-user">

              <div className="dashboard-user-info">
                <strong>Admin User</strong>
                <span>Organizer</span>
              </div>

              <div className="dashboard-avatar">
                A
              </div>

            </div>

          </header>

          {/* CONTENT */}

          <section className="dashboard-content">

            <div className="dashboard-breadcrumb">
              Workspace / {activePage}
            </div>

            <div className="dashboard-heading">

              <div>
                <h1>
                  {activePage === "Overview"
                    ? "Overview"
                    : activePage}
                </h1>

                <p>
                  Here's what's happening in your workspace.
                </p>
              </div>

              <button
                className="dashboard-primary-btn"
                onClick={() => navigate("/submit-project")}
              >
                <Plus size={17} />
                Submit Project
              </button>

            </div>

            {/* ================= STATS ================= */}

            <div className="dashboard-stats">

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <FolderKanban size={22} />
                </div>

                <div>
                  <span>Total Projects</span>
                  <strong>{projects.length}</strong>
                </div>

              </div>

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <CheckCircle size={22} />
                </div>

                <div>
                  <span>Submitted</span>
                  <strong>{submittedProjects.length}</strong>
                </div>

              </div>

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <Trophy size={22} />
                </div>

                <div>
                  <span>Hackathons</span>
                  <strong>1</strong>
                </div>

              </div>

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <Users size={22} />
                </div>

                <div>
                  <span>Teams</span>
                  <strong>
                    {new Set(
                      projects
                        .map((p) => p.team_name)
                        .filter(Boolean)
                    ).size}
                  </strong>
                </div>

              </div>

            </div>

            {/* ================= PROJECTS ================= */}

            <div className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <h2>Recent Projects</h2>

                  <p>
                    Projects submitted to your hackathons
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigateTo("/projects", "Projects")
                  }
                >
                  View all
                </button>

              </div>

              {loading ? (
                <div className="dashboard-empty">
                  <p>Loading projects...</p>
                </div>
              ) : filteredProjects.length === 0 ? (

                <div className="dashboard-empty">

                  <FileText size={38} />

                  <h3>No projects found</h3>

                  <p>
                    Submit your first project to get started.
                  </p>

                </div>

              ) : (

                <div className="dashboard-project-list">

                  {filteredProjects
                    .slice(0, 5)
                    .map((project) => {

                      const projectName =
                        project.name ||
                        project.project_name ||
                        "Untitled Project";

                      const teamName =
                        project.team_name ||
                        "No team";

                      const status =
                        project.status ||
                        (project.submitted
                          ? "submitted"
                          : "draft");

                      return (
                        <div
                          className="dashboard-project-item"
                          key={project.id}
                        >

                          <div className="dashboard-project-left">

                            <div className="dashboard-project-icon">
                              <FolderKanban size={20} />
                            </div>

                            <div className="dashboard-project-info">

                              <h3>
                                {projectName}
                              </h3>

                              <p>
                                Team: {teamName}
                              </p>

                            </div>

                          </div>

                          <div className="dashboard-project-right">

                            <Clock size={15} />

                            <span
                              className={`dashboard-status ${
                                status === "submitted"
                                  ? "submitted"
                                  : status === "pending"
                                  ? "pending"
                                  : "draft"
                              }`}
                            >
                              {status}
                            </span>

                          </div>

                        </div>
                      );
                    })}

                </div>

              )}

            </div>

            {/* ================= HACKATHON ================= */}

            <div className="dashboard-section">

              <div className="dashboard-section-header">

                <div>
                  <h2>Active Hackathons</h2>

                  <p>
                    Hackathons currently available
                  </p>
                </div>

              </div>

              <div className="dashboard-hackathons">

                <div className="dashboard-hackathon-card">

                  <h3>
                    Dogfood Hackathon 2026
                  </h3>

                  <p>
                    Open Innovation
                  </p>

                  <p style={{ marginTop: "8px" }}>
                    Submission deadline: September 30,
                    2026
                  </p>

                </div>

              </div>

            </div>

          </section>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;