import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Medal,
  Search,
  Trophy,
  Users,
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
    loadHackathons();
  }, []);

  useEffect(() => {
    if (selectedHackathon) {
      loadLeaderboard(selectedHackathon);
    }
  }, [selectedHackathon]);

  async function loadHackathons() {
    try {
      setLoading(true);
      setError("");

      const data = await getHackathons();

      const list = data.hackathons || [];
      setHackathons(list);

      if (list.length > 0) {
        setSelectedHackathon(String(list[0].id));
      }
    } catch (err) {
      setError(err.message || "Unable to load hackathons.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLeaderboard(id) {
    try {
      setLoading(true);
      setError("");

      const data = await getLeaderboard(id);

      setProjects(data.leaderboard || data.projects || []);
    } catch (err) {
      setError(err.message || "Unable to load leaderboard.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((project) =>
    String(
      project.project_name ||
        project.name ||
        ""
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">

        <button
          className="leaderboard-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="leaderboard-heading">
          <div className="leaderboard-title-row">
            <div className="leaderboard-title-icon">
              <Medal size={24} />
            </div>

            <div>
              <h1>Leaderboard</h1>
              <p>
                View project rankings and evaluation results.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
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
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <select
            value={selectedHackathon}
            onChange={(e) =>
              setSelectedHackathon(e.target.value)
            }
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">
              Select Hackathon
            </option>

            {hackathons.map((hackathon) => (
              <option
                key={hackathon.id}
                value={hackathon.id}
              >
                {hackathon.name}
              </option>
            ))}
          </select>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "0 12px",
            }}
          >
            <Search size={17} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search projects..."
              style={{
                border: "none",
                outline: "none",
                padding: "10px",
              }}
            />
          </div>

          <button
            onClick={() =>
              selectedHackathon &&
              loadLeaderboard(selectedHackathon)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="leaderboard-empty">
            <Trophy size={40} />
            <h2>Loading leaderboard...</h2>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="leaderboard-empty">
            <Trophy size={40} />
            <h2>No ranked projects yet</h2>
            <p>
              Submitted projects will appear here after
              evaluations are available.
            </p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {filteredProjects.map((project, index) => {
              const name =
                project.project_name ||
                project.name ||
                "Untitled Project";

              const team =
                project.team_name ||
                project.team ||
                "Unknown Team";

              const average =
                project.average_score ??
                project.avg_score ??
                0;

              const judges =
                project.judges_count ??
                project.judge_count ??
                0;

              return (
                <div
                  className="leaderboard-row"
                  key={project.project_id || project.id}
                >
                  <div className="leaderboard-rank">
                    {index === 0 ? (
                      <Trophy size={22} />
                    ) : (
                      `#${index + 1}`
                    )}
                  </div>

                  <div className="leaderboard-project">
                    <h3>{name}</h3>

                    <span>
                      <Users size={14} />
                      {team}
                    </span>
                  </div>

                  <div className="leaderboard-judges">
                    {judges} judge
                    {judges !== 1 ? "s" : ""}
                  </div>

                  <div className="leaderboard-score">
                    <strong>
                      {Number(average).toFixed(2)}
                    </strong>
                    <span>/ 100</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default Leaderboard;