import { getEvaluations } from "../utils/projectStorage";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  ArrowLeft,
  ExternalLink,
  Search,
} from "lucide-react";
import { useState } from "react";
import "./Leaderboard.css";

const initialProjects = [
  {
    id: 1,
    name: "Smart Traffic AI",
    team: "Code Warriors",
    hackathon: "AI Innovation Challenge",
    score: 95,
    members: 4,
  },
  {
    id: 2,
    name: "HealthCare Connect",
    team: "Tech Titans",
    hackathon: "AI Innovation Challenge",
    score: 91,
    members: 3,
  },
  {
    id: 3,
    name: "EcoTrack",
    team: "Green Coders",
    hackathon: "Green Tech Hackathon",
    score: 87,
    members: 4,
  },
  {
    id: 4,
    name: "Campus Companion",
    team: "Byte Builders",
    hackathon: "College Hackathon",
    score: 82,
    members: 3,
  },
  {
    id: 5,
    name: "AgriVision",
    team: "Future Minds",
    hackathon: "Green Tech Hackathon",
    score: 78,
    members: 4,
  },
];


function Leaderboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const evaluations = getEvaluations();

  const evaluatedProjects = Object.values(evaluations)
  .map((evaluation) => ({
    ...evaluation.project,
    score: evaluation.total,
  }));

const evaluatedIds = new Set(
  evaluatedProjects.map((project) => String(project.id))
);

const projects = [
  ...initialProjects.filter(
    (project) => !evaluatedIds.has(String(project.id))
  ),
  ...evaluatedProjects,
].sort((a, b) => b.score - a.score);

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.team} ${project.hackathon}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const topThree = projects.slice(0, 3);

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
              Explore the top-performing projects based
              on their evaluation scores.
            </p>
          </div>
          <Trophy className="lb-hero-trophy" size={76} />
        </section>

        <section className="lb-podium">
          {topThree.map((project, index) => (
            <div
              className={`lb-podium-card rank-${index + 1}`}
              key={project.id}
            >
              <div className="lb-medal">
                {index === 0 ? (
                  <Trophy size={25} />
                ) : (
                  <Medal size={25} />
                )}
              </div>

              <span className="lb-rank">
                Rank #{index + 1}
              </span>

              <h3>{project.name}</h3>
              <p>{project.team}</p>

              <div className="lb-podium-score">
                {project.score}
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

            <div className="lb-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search projects or teams"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                {filteredProjects.map((project) => {
                  const rank =
                    projects.findIndex(
                      (item) => item.id === project.id
                    ) + 1;

                  return (
                    <tr key={project.id}>
                      <td>
                        <span
                          className={`lb-rank-number ${
                            rank <= 3 ? "top-rank" : ""
                          }`}
                        >
                          {rank <= 3 ? (
                            <Trophy size={16} />
                          ) : (
                            `#${rank}`
                          )}
                        </span>
                      </td>
                      <td>
                        <strong>{project.name}</strong>
                      </td>
                      <td>{project.team}</td>
                      <td>{project.hackathon}</td>
                      <td>
                        <span className="lb-score">
                          {project.score}
                          <small>/100</small>
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="lb-empty">
                      {search
                        ? "No matching projects found."
                        : "No evaluated projects yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;