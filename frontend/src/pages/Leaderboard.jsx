
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Medal,
  Search,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { getHackathons, getLeaderboard } from "../utils/api";
import "./Leaderboard.css";

function Leaderboard() {
  const navigate = useNavigate();

  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const data = await getHackathons();
        const list = data.hackathons || [];
        setHackathons(list);

        if (list.length > 0) {
          setSelectedHackathon(String(list[0].id));
        } else {
          setProjects([]);
        }
      } catch (err) {
        setError(err.message || "Unable to load hackathons.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!selectedHackathon) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getLeaderboard(selectedHackathon);
        const list = data.leaderboard || data.projects || [];

        const normalized = list.map((project) => ({
          ...project,
          id: project.project_id ?? project.id,
          name:
            project.project_name ??
            project.name ??
            "Untitled Project",
          team:
            project.team_name ??
            project.team ??
            "Unknown Team",
          hackathon:
            project.hackathon_name ??
            hackathons.find(
              (h) => String(h.id) === String(selectedHackathon)
            )?.name ??
            "Hackathon",
          score: Number(
            project.average_score ??
            project.avg_score ??
            project.total_score ??
            project.score ??
            0
          ),
        }));

        normalized.sort((a, b) => b.score - a.score);
        setProjects(normalized);
      } catch (err) {
        setProjects([]);
        setError(err.message || "Unable to load leaderboard.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedHackathon, hackathons]);

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.team} ${project.hackathon}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const topThree = filteredProjects.slice(0, 3);

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <button
          className="lb-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="lb-heading">
          <div className="lb-title-icon">
            <Trophy size={26} />
          </div>
          <div>
            <h1>Leaderboard</h1>
            <p>Track project performance and rankings</p>
          </div>
        </div>
      </header>

      <main className="lb-content">
        <section className="lb-hero">
          <div>
            <span className="lb-eyebrow">HACKHUB RANKINGS</span>
            <h2>Project Leaderboard</h2>
            <p>
              Explore top-performing projects based on evaluation scores.
            </p>
          </div>
          <Trophy className="lb-hero-trophy" size={76} />
        </section>

        {error && (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <select
            aria-label="Select hackathon"
            value={selectedHackathon}
            onChange={(e) => setSelectedHackathon(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fff",
            }}
          >
            <option value="">Select Hackathon</option>
            {hackathons.map((hackathon) => (
              <option key={hackathon.id} value={String(hackathon.id)}>
                {hackathon.name}
              </option>
            ))}
          </select>

          <div className="lb-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search projects or teams"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedHackathon) {
                setSelectedHackathon((value) => value);
                // Re-fetch by selecting the same hackathon.
                window.dispatchEvent(new Event("leaderboard-refresh"));
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="lb-empty">
            Loading leaderboard...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="lb-empty">
            {search
              ? "No matching projects found."
              : "No evaluated projects yet."}
          </div>
        ) : (
          <>
            <section className="lb-podium">
              {topThree.map((project, index) => (
                <div
                  className={`lb-podium-card rank-${index + 1}`}
                  key={project.id ?? `${project.name}-${index}`}
                >
                  <div className="lb-medal">
                    {index === 0 ? (
                      <Trophy size={25} />
                    ) : (
                      <Medal size={25} />
                    )}
                  </div>
                  <span className="lb-rank">Rank #{index + 1}</span>
                  <h3>{project.name}</h3>
                  <p>{project.team}</p>
                  <div className="lb-podium-score">
                    {project.score.toFixed(2)}
                    <span>/100</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="lb-table-section">
              <div className="lb-table-heading">
                <div>
                  <h2>All Projects</h2>
                  <p>Rankings based on evaluation scores</p>
                </div>
              </div>

              <div className="lb-table-wrapper">
                <table className="lb-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Project</th>
                      <th>Team</th>
                      <th>Hackathon</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project, index) => (
                      <tr
                        key={project.id ?? `${project.name}-${index}`}
                      >
                        <td>
                          <span
                            className={`lb-rank-number ${
                              index < 3 ? "top-rank" : ""
                            }`}
                          >
                            {index < 3 ? (
                              <Trophy size={16} />
                            ) : (
                              `#${index + 1}`
                            )}
                          </span>
                        </td>
                        <td><strong>{project.name}</strong></td>
                        <td>{project.team}</td>
                        <td>{project.hackathon}</td>
                        <td>
                          <span className="lb-score">
                            {project.score.toFixed(2)}
                            <small>/100</small>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Leaderboard;
