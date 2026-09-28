import { useEffect, useState } from "react";
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
  getMyAssignments,
  getCriteria,
  submitReview,
} from "../utils/api";
import "./Judging.css";

const criteriaFallback = [
  {
    id: 1,
    name: "Innovation",
    description: "Originality and creativity of the idea",
    max_score: 25,
  },
  {
    id: 2,
    name: "Technical Implementation",
    description: "Quality of implementation and technical execution",
    max_score: 25,
  },
  {
    id: 3,
    name: "Impact",
    description: "Potential usefulness and real-world impact",
    max_score: 25,
  },
  {
    id: 4,
    name: "Presentation",
    description: "Clarity and effectiveness of the presentation",
    max_score: 25,
  },
];

function normalizeProject(project) {
  return {
    ...project,
    name: project.name || project.project_name || "Untitled Project",
    team:
      project.team_name ||
      project.teamName ||
      project.team ||
      "Unknown Team",
    hackathon:
      project.hackathon_name ||
      project.hackathon ||
      "Unspecified Hackathon",
    description:
      project.description || "No description provided.",
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

  const [projects, setProjects] = useState([]);
  const [criteria, setCriteria] = useState(criteriaFallback);
  const [completedReviews, setCompletedReviews] = useState([]);

  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJudgingData();
  }, []);

  const loadJudgingData = async () => {
    setLoading(true);
    setError("");

    try {
      let token = localStorage.getItem("judgeToken");

      /*
       * Temporary seeded judge login for hackathon demo.
       * Later this will come from the actual login page.
       */
      if (!token) {
        const loginResponse = await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "judge@dogfood.local",
              password: "judge123",
            }),
          }
        );

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(
            loginData.message || "Judge login failed."
          );
        }

        token = loginData.token;
        localStorage.setItem("judgeToken", token);
      }

      const assignments = await getMyAssignments(token);

      const assignmentList =
        assignments.assignments || assignments.projects || [];

      const normalizedProjects = assignmentList
        .filter(
          (assignment) =>
            assignment.status !== "completed"
        )
        .map((assignment) =>
          normalizeProject(
            assignment.project || assignment
          )
        );

      setProjects(normalizedProjects);

      const hackathonIds = [
        ...new Set(
          assignmentList
            .map(
              (assignment) =>
                assignment.project?.hackathon_id ||
                assignment.hackathon_id
            )
            .filter(Boolean)
        ),
      ];

      if (hackathonIds.length > 0) {
        const criteriaResponse = await getCriteria(
          hackathonIds[0],
          token
        );

        if (
          criteriaResponse.criteria &&
          criteriaResponse.criteria.length > 0
        ) {
          setCriteria(criteriaResponse.criteria);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to load judging assignments."
      );
    } finally {
      setLoading(false);
    }
  };

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
    setFeedback("");
    setError("");
  };

  const closeEvaluation = () => {
    if (!submitting) {
      setSelected(null);
    }
  };

  const submitEvaluation = async (e) => {
    e.preventDefault();

    if (!selected || !allScoresEntered) return;

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("judgeToken");

      const scoreList = criteria.map((criterion) => ({
        criterion_id: criterion.id,
        score: Number(scores[criterion.name]),
      }));

      await submitReview(
        selected.id,
        {
          scores: scoreList,
          feedback: feedback.trim(),
        },
        token
      );

      setCompletedReviews((prev) => [
        ...prev,
        selected.id,
      ]);

      setProjects((prev) =>
        prev.filter(
          (project) =>
            String(project.id) !==
            String(selected.id)
        )
      );

      setSelected(null);
      setScores({});
      setFeedback("");
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to submit evaluation."
      );
    } finally {
      setSubmitting(false);
    }
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
              Review projects, assign scores and provide
              feedback.
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}

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
              <strong>{completedReviews.length}</strong>
            </div>
          </div>
        </div>

        <div className="judging-section-heading">
          <div>
            <h2>Projects to Evaluate</h2>
            <p>
              Select a project to begin its evaluation.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="judging-empty">
            <ClipboardCheck size={38} />
            <h2>Loading assignments...</h2>
            <p>
              Fetching your assigned projects from the
              backend.
            </p>
          </div>
        ) : projects.length > 0 ? (
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
                    {project.technologies.map(
                      (tech, index) => (
                        <span
                          key={`${tech}-${index}`}
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <button
                  className="judging-evaluate-btn"
                  onClick={() =>
                    openEvaluation(project)
                  }
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
              There are no more projects awaiting
              evaluation.
            </p>
          </div>
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
            onClick={(e) =>
              e.stopPropagation()
            }
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
                  Give each criterion a score from 0 to
                  25.
                </p>

                <div className="judging-criteria">
                  {criteria.map((item) => (
                    <div
                      className="judging-criterion"
                      key={item.id || item.name}
                    >
                      <div className="judging-criterion-heading">
                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <small>
                            {item.description}
                          </small>
                        </div>

                        <span>
                          / {item.max_score || 25}
                        </span>
                      </div>

                      <div className="judging-score-input">
                        <Star size={17} />

                        <input
                          type="number"
                          min="0"
                          max={item.max_score || 25}
                          step="1"
                          required
                          value={
                            scores[item.name] ?? ""
                          }
                          onChange={(e) => {
                            const value =
                              e.target.value;

                            if (
                              value === "" ||
                              (/^\d+$/.test(value) &&
                                Number(value) <=
                                  (item.max_score ||
                                    25))
                            ) {
                              handleScoreChange(
                                item.name,
                                value
                              );
                            }
                          }}
                          placeholder="0-25"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="judging-total">
                  <span>Total Score</span>

                  <strong>
                    {totalScore}{" "}
                    <small>/ 100</small>
                  </strong>
                </div>

                <div className="judging-feedback">
                  <label htmlFor="judge-feedback">
                    Judge's Feedback
                  </label>

                  <textarea
                    id="judge-feedback"
                    rows="4"
                    value={feedback}
                    onChange={(e) =>
                      setFeedback(e.target.value)
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
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="judging-submit-btn"
                  disabled={
                    !allScoresEntered ||
                    submitting
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Evaluation"}
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