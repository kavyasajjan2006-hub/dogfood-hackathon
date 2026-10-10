
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FolderKanban,
  Trophy,
  ClipboardCheck,
  Medal,
  Plus,
  Clock,
  CheckCircle,
  Users,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  UserRound,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";
import { getProjects } from "../utils/api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hackhub_user")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    function syncUser() {
      try {
        setUser(JSON.parse(localStorage.getItem("hackhub_user")) || {});
      } catch {
        setUser({});
      }
    }

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await getProjects();

        if (cancelled) return;

        const data = Array.isArray(response)
          ? response
          : response?.projects || response?.data || [];

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load projects.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("hackhub_token");
    localStorage.removeItem("hackhub_user");
    setProfileOpen(false);
    navigate("/login", { replace: true });
  }

  function openPage(path) {
    setProfileOpen(false);
    navigate(path);
  }

  const displayName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const displayEmail = user?.email || "Account";
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const filteredProjects = projects.filter((project) => {
    const text = [
      project.title,
      project.name,
      project.description,
      project.hackathon_name,
      project.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
    },
    {
      label: "Hackathons",
      value: new Set(
        projects.map((project) => project.hackathon_id).filter(Boolean)
      ).size,
      icon: Trophy,
    },
    {
      label: "Evaluations",
      value: projects.filter(
        (project) => project.status === "evaluated"
      ).length,
      icon: ClipboardCheck,
    },
    {
      label: "Completed",
      value: projects.filter(
        (project) => project.status === "completed"
      ).length,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="brand-icon">
            <Trophy size={23} />
          </div>
          <span>HackHub</span>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="sidebar-navigation">
          <button
            className="sidebar-link active"
            onClick={() => openPage("/dashboard")}
          >
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => openPage("/hackathons")}
          >
            <CalendarDays size={19} />
            <span>Hackathons</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => openPage("/projects")}
          >
            <FolderKanban size={19} />
            <span>Projects</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => openPage("/judging")}
          >
            <ClipboardCheck size={19} />
            <span>Judging</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => openPage("/leaderboard")}
          >
            <Medal size={19} />
            <span>Leaderboard</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              <UserRound size={20} />
            </div>

            <div className="sidebar-user-details">
              <strong>{displayName}</strong>
              <span>{user?.role || "Participant"}</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-heading">
            <h1>Dashboard</h1>
            <p>Welcome back, {displayName}!</p>
          </div>

          <div className="header-actions">
            {isAdmin && (
              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/create-hackathon")}
              >
                <Plus size={18} />
                Create Hackathon
              </button>
            )}

            <label className="dashboard-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <div className="profile-menu-wrapper">
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                <div className="user-avatar header-avatar">
                  <UserRound size={20} />
                </div>

                <div className="profile-trigger-text">
                  <strong>{displayName}</strong>
                  <span>{user?.role || "Participant"}</span>
                </div>

                <ChevronDown size={17} />
              </button>

              {profileOpen && (
                <>
                  <button
                    type="button"
                    className="profile-menu-backdrop"
                    aria-label="Close profile menu"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="profile-dropdown">
                    <div className="profile-dropdown-heading">
                      <strong>{displayName}</strong>
                      <span>{displayEmail}</span>
                    </div>

                    <button
                      type="button"
                      className="profile-dropdown-item"
                      onClick={() => openPage("/profile")}
                    >
                      <UserRound size={18} />
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      className="profile-dropdown-item"
                      onClick={() => openPage("/settings")}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>

                    <div className="profile-dropdown-divider" />

                    <button
                      type="button"
                      className="profile-dropdown-item logout-menu-item"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-welcome-card">
            <div>
              <span className="welcome-eyebrow">YOUR WORKSPACE</span>
              <h2>Build something amazing.</h2>
              <p>
                Manage your hackathon projects, track submissions, and
                follow your progress from one place.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/submit-project")}
              >
                <Plus size={19} />
                Submit a Project
              </button>
            </div>

            <div className="welcome-illustration">
              <Trophy size={78} strokeWidth={1.3} />
            </div>
          </div>

          <div className="dashboard-section-heading">
            <div>
              <h2>Overview</h2>
              <p>Here is a summary of your workspace.</p>
            </div>
          </div>

          <div className="dashboard-stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="dashboard-stat-card" key={stat.label}>
                  <div className="stat-card-top">
                    <span>{stat.label}</span>
                    <div className="stat-icon">
                      <Icon size={21} />
                    </div>
                  </div>

                  <strong className="stat-value">{stat.value}</strong>
                </article>
              );
            })}
          </div>

          <section className="projects-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Recent Projects</h2>
                <p>Your latest project submissions.</p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/projects")}
              >
                View all
              </button>
            </div>

            {loading ? (
              <div className="dashboard-message">
                <Clock size={20} />
                Loading projects...
              </div>
            ) : error ? (
              <div className="dashboard-message error-message">
                {error}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="empty-projects-card">
                <div className="empty-projects-icon">
                  <FolderKanban size={30} />
                </div>

                <h3>
                  {search ? "No matching projects" : "No projects yet"}
                </h3>

                <p>
                  {search
                    ? "Try another search term."
                    : "Submit your first project to see it listed here."}
                </p>

                {!search && (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate("/submit-project")}
                  >
                    <Plus size={18} />
                    Create Project
                  </button>
                )}
              </div>
            ) : (
              <div className="projects-list">
                {filteredProjects.slice(0, 5).map((project, index) => (
                  <article
                    className="project-row"
                    key={project.id || project.project_id || index}
                  >
                    <div className="project-row-icon">
                      <FolderKanban size={22} />
                    </div>

                    <div className="project-row-details">
                      <strong>
                        {project.title || project.name || "Untitled Project"}
                      </strong>
                      <span>
                        {project.hackathon_name ||
                          project.hackathon_title ||
                          "Hackathon project"}
                      </span>
                    </div>

                    <span
                      className={`project-status ${
                        String(project.status || "submitted").toLowerCase()
                      }`}
                    >
                      {project.status || "Submitted"}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-bottom-card">
            <div className="bottom-card-icon">
              <Users size={23} />
            </div>
            <div>
              <h3>Keep building with HackHub</h3>
              <p>
                Explore hackathons, submit your ideas, and follow project
                evaluations.
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/hackathons")}
            >
              Explore Hackathons
            </button>
          </section>
        </section>
      </main>
    </div>
  );
}
