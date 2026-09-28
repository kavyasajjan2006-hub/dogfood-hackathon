
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  Star,
  Users,
  X,
  CheckCircle,
} from "lucide-react";
import {
  getProjects,
  getEvaluations,
  saveEvaluations,
} from "../utils/projectStorage";
import "./Judging.css";

const initialProjects = [
  {
    id: 1,
    name: "Smart Waste Management",
    team: "EcoTech",
    hackathon: "Green Tech Challenge",
    description:
      "An intelligent waste management system that helps monitor waste collection and improve recycling.",
    technologies: ["React", "Python", "MySQL"],
  },
  {
    id: 2,
    name: "AI Health Assistant",
    team: "Innovators",
    hackathon: "AI Innovation Challenge",
    description:
      "An AI-powered assistant that provides general health information and helps users understand common health concerns.",
    technologies: ["React", "Python", "Machine Learning"],
  },
  {
    id: 3,
    name: "Smart City Traffic Monitor",
    team: "CodeStorm",
    hackathon: "Smart City Hackathon",
    description:
      "A traffic monitoring application that uses computer vision to analyze traffic flow and identify congestion.",
    technologies: ["Python", "OpenCV", "React"],
  },
];

const criteria = [
  {
    name: "Innovation",
    description: "Originality and creativity of the idea",
  },
  {
    name: "Technical Implementation",
    description: "Quality of implementation and technical execution",
  },
  {
    name: "Impact",
    description: "Potential usefulness and real-world impact",
  },
  {
    name: "Presentation",
    description: "Clarity and effectiveness of the presentation",
  },
];

function normalizeProject(project) {
  return {
    ...project,
    name: project.projectName || project.name || "Untitled Project",
    team: project.teamName || project.team || "Unknown Team",
    hackathon: project.hackathon || "Unspecified Hackathon",
    description: project.description || "No description provided.",
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === "string"
        ? project.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean)
        : [],
  };
}

function Judging() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState(() =>
    getEvaluations()
  );

  const [projects, setProjects] = useState(() => {
    const savedProjects = getProjects().map(normalizeProject);
    const allProjects = [...initialProjects, ...savedProjects];
    const completed = getEvaluations();

    return allProjects.filter(
      (project) => !completed[String(project.id)]
    );
  });

  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState({});

  const totalScore = criteria.reduce(
    (total, item) =>
      total + (Number(scores[item.name]) || 0),
    0
  );

  const allScoresEntered = criteria.every(
    (item) =>
      scores[item.name] !== undefined &&
      scores[item.name] !== ""
  );

  const handleScoreChange = (name, value) => {
    setScores((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEvaluation = (project) => {
    setSelected(project);
    setScores({});
    setFeedback({});
  };

  const closeEvaluation = () => {
    setSelected(null);
  };

  const submitEvaluation = (e) => {
    e.preventDefault();

    if (!selected || !allScoresEntered) return;

    const updatedEvaluations = {
      ...evaluations,
      [String(selected.id)]: {
        project: selected,
        total: totalScore,
        scores: { ...scores },
        feedback: feedback[selected.id] || "",
        evaluatedAt: new Date().toISOString(),
      },
    };

    try {
      saveEvaluations(updatedEvaluations);
    } catch (error) {
      console.error("Unable to save evaluation:", error);
      alert("Unable to save evaluation. Please try again.");
      return;
    }

    setEvaluations(updatedEvaluations);

    setProjects((prev) =>
      prev.filter(
        (project) => String(project.id) !== String(selected.id)
      )
    );

    setSelected(null);
  };

  return (
    <div className="judging-page">
      <div className="judging-container">
        <button
          className="judging-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="judging-heading">
          <div>
            <div className="judging-title-row">
              <div className="judging-title-icon">
                <ClipboardCheck size={24} />
              </div>
              <h1>Project Judging</h1>
            </div>
            <p>
              Review projects, assign scores and provide feedback.
            </p>
          </div>
        </div>

        <div className="judging-stats">
          <div className="judging-stat-card">
            <div className="judging-stat-icon purple">
              <ClipboardCheck size={21} />
            </div>
            <div>
              <span>Pending Evaluations</span>
              <strong>{projects.length}</strong>
            </div>
          </div>

          <div className="judging-stat-card">
            <div className="judging-stat-icon green">
              <CheckCircle size={21} />
            </div>
            <div>
              <span>Completed Evaluations</span>
              <strong>{Object.keys(evaluations).length}</strong>
            </div>
          </div>
        </div>

        <div className="judging-section-heading">
          <div>
            <h2>Projects to Evaluate</h2>
            <p>Select a project to begin its evaluation.</p>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="judging-project-list">
            {projects.map((project) => (
              <article
                className="judging-project-card"
                key={project.id}
              >
                <div className="judging-project-icon">
                  <ClipboardCheck size={22} />
                </div>

                <div className="judging-project-info">
                  <h3>{project.name}</h3>

                  <p className="judging-team">
                    <Users size={15} />
                    {project.team}
                  </p>

                  <span className="judging-hackathon">
                    {project.hackathon}
                  </span>

                  <div className="judging-tags">
                    {project.technologies.map((tech, index) => (
                      <span key={`${tech}-${index}`}>{tech}</span>
                    ))}
                  </div>
                </div>

                <button
                  className="judging-evaluate-btn"
                  onClick={() => openEvaluation(project)}
                >
                  Evaluate
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="judging-empty">
            <CheckCircle size={38} />
            <h2>All evaluations completed</h2>
            <p>
              There are no more projects awaiting evaluation.
            </p>
          </div>
        )}

        {Object.keys(evaluations).length > 0 && (
          <section className="judging-completed">
            <h2>Completed Evaluations</h2>

            {Object.entries(evaluations).map(([id, evaluation]) => (
              <div className="judging-completed-row" key={id}>
                <span>
                  {evaluation.project?.name || "Unknown Project"}
                </span>
                <strong>{evaluation.total} / 100</strong>
              </div>
            ))}
          </section>
        )}
      </div>

      {selected && (
        <div
          className="judging-modal-backdrop"
          onClick={closeEvaluation}
        >
          <div
            className="judging-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judging-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="judging-modal-header">
              <div>
                <span className="judging-hackathon">
                  {selected.hackathon}
                </span>
                <h2 id="judging-modal-title">
                  {selected.name}
                </h2>
                <p>{selected.team}</p>
              </div>

              <button
                className="judging-close-btn"
                type="button"
                onClick={closeEvaluation}
                aria-label="Close evaluation"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitEvaluation}>
              <div className="judging-modal-body">
                <h3>Project Description</h3>
                <p className="judging-modal-description">
                  {selected.description}
                </p>

                <h3>Evaluation Criteria</h3>
                <p className="judging-helper">
                  Give each criterion a score from 0 to 25.
                </p>

                <div className="judging-criteria">
                  {criteria.map((item) => (
                    <div
                      className="judging-criterion"
                      key={item.name}
                    >
                      <div className="judging-criterion-heading">
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </div>
                        <span>/ 25</span>
                      </div>

                      <div className="judging-score-input">
                        <Star size={17} />
                        <input
                          type="number"
                          min="0"
                          max="25"
                          step="1"
                          required
                          value={scores[item.name] ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (
                              value === "" ||
                              (/^\d+$/.test(value) &&
                                Number(value) <= 25)
                            ) {
                              handleScoreChange(item.name, value);
                            }
                          }}
                          placeholder="0–25"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="judging-total">
                  <span>Total Score</span>
                  <strong>
                    {totalScore} <small>/ 100</small>
                  </strong>
                </div>

                <div className="judging-feedback">
                  <label htmlFor="judge-feedback">
                    Judge's Feedback
                  </label>
                  <textarea
                    id="judge-feedback"
                    rows="4"
                    value={feedback[selected.id] || ""}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        [selected.id]: e.target.value,
                      }))
                    }
                    placeholder="Share constructive feedback about this project..."
                  />
                </div>
              </div>

              <div className="judging-modal-footer">
                <button
                  type="button"
                  className="judging-cancel-btn"
                  onClick={closeEvaluation}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="judging-submit-btn"
                  disabled={!allScoresEntered}
                >
                  Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Judging;