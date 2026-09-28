import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ExternalLink,
  GitBranch,
  Plus,
  X,
  Users,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";

import "./Projects.css";
import { getProjects } from "../utils/api";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      // Backend normally returns an array.
      // This also handles { projects: [...] } if the response is wrapped.
      const projectList = Array.isArray(data)
        ? data
        : data.projects || [];

      setProjects(projectList);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const projectName =
        project.name ||
        project.project_name ||
        project.title ||
        "";

      const teamName =
        project.team_name ||
        project.teamName ||
        "";

      const hackathonName =
        project.hackathon_name ||
        project.hackathon ||
        "";

      const status =
        project.status ||
        (project.submitted ? "submitted" : "draft");

      const searchableText = `
        ${projectName}
        ${teamName}
        ${hackathonName}
        ${project.description || ""}
        ${project.technologies || ""}
      `.toLowerCase();

      const matchesSearch =
        searchTerm.trim() === "" ||
        searchableText.includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  function getProjectName(project) {
    return (
      project.name ||
      project.project_name ||
      project.title ||
      "Untitled Project"
    );
  }

  function getTeamName(project) {
    return (
      project.team_name ||
      project.teamName ||
      "No team"
    );
  }

  function getHackathonName(project) {
    return (
      project.hackathon_name ||
      project.hackathon ||
      "Hackathon"
    );
  }

  function getStatus(project) {
    return (
      project.status ||
      (project.submitted ? "submitted" : "draft")
    ).toLowerCase();
  }

  function getDescription(project) {
    return (
      project.description ||
      "No description provided."
    );
  }

  function getTechnologies(project) {
    const technologies =
      project.technologies ||
      project.tech_stack ||
      project.techStack ||
      "";

    if (Array.isArray(technologies)) {
      return technologies;
    }

    if (typeof technologies === "string") {
      return technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  }

  function getGithubUrl(project) {
    return (
      project.github_url ||
      project.github ||
      project.githubUrl ||
      ""
    );
  }

  function getDemoUrl(project) {
    return (
      project.demo_url ||
      project.demo ||
      project.demoUrl ||
      ""
    );
  }

  function formatDate(dateValue) {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString();
  }

  function handleCreateProject() {
    navigate("/submit-project");
  }

  return (
    <div className="projects-page">
      <div className="projects-container">

        {/* HEADER */}
        <div className="projects-header">
          <div>
            <h1>Projects</h1>
            <p>
              Explore projects submitted to your hackathons.
            </p>
          </div>

          <button
            className="submit-project-btn"
            onClick={handleCreateProject}
          >
            <Plus size={18} />
            Submit Project
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="projects-toolbar">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search projects, teams, hackathons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <Filter size={18} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">All Projects</option>
              <option value="submitted">Submitted</option>
              <option value="draft">Draft</option>
            </select>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="projects-error">
            <strong>Unable to load projects</strong>
            <p>{error}</p>

            <button onClick={loadProjects}>
              Try Again
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="projects-loading">
            Loading projects...
          </div>
        )}

        {/* PROJECT COUNT */}
        {!loading && !error && (
          <div className="projects-count">
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""} found
          </div>
        )}

        {/* PROJECTS */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="projects-grid">

            {filteredProjects.map((project) => {
              const status = getStatus(project);
              const technologies = getTechnologies(project);

              return (
                <div
                  className="project-card"
                  key={
                    project.id ||
                    project.project_id ||
                    getProjectName(project)
                  }
                >

                  {/* CARD HEADER */}
                  <div className="project-card-header">

                    <div className="project-icon">
                      <GitBranch size={22} />
                    </div>

                    <span
                      className={`project-status ${status}`}
                    >
                      {status === "submitted" ? (
                        <>
                          <CheckCircle size={14} />
                          Submitted
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          Draft
                        </>
                      )}
                    </span>

                  </div>

                  {/* PROJECT NAME */}
                  <h2>{getProjectName(project)}</h2>

                  {/* HACKATHON */}
                  <p className="project-hackathon">
                    <Calendar size={15} />
                    {getHackathonName(project)}
                  </p>

                  {/* TEAM */}
                  <p className="project-team">
                    <Users size={15} />
                    {getTeamName(project)}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="project-description">
                    {getDescription(project)}
                  </p>

                  {/* TECHNOLOGIES */}
                  {technologies.length > 0 && (
                    <div className="technology-list">
                      {technologies.slice(0, 5).map(
                        (technology, index) => (
                          <span
                            className="technology-tag"
                            key={`${technology}-${index}`}
                          >
                            {technology}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {/* DATE */}
                  {project.submitted_at && (
                    <div className="project-date">
                      Submitted:{" "}
                      {formatDate(project.submitted_at)}
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="project-actions">

                    <button
                      className="view-project-btn"
                      onClick={() =>
                        setSelectedProject(project)
                      }
                    >
                      View Details
                    </button>

                    {getGithubUrl(project) && (
                      <a
                        className="icon-link"
                        href={getGithubUrl(project)}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub Repository"
                      >
                        <GitBranch size={18} />
                      </a>
                    )}

                    {getDemoUrl(project) && (
                      <a
                        className="icon-link"
                        href={getDemoUrl(project)}
                        target="_blank"
                        rel="noreferrer"
                        title="Live Demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* NO PROJECTS */}
        {!loading &&
          !error &&
          filteredProjects.length === 0 && (
            <div className="no-projects">

              <GitBranch size={42} />

              <h2>No projects found</h2>

              <p>
                {projects.length === 0
                  ? "No projects have been submitted yet."
                  : "Try changing your search or filter."}
              </p>

              {projects.length === 0 && (
                <button
                  onClick={handleCreateProject}
                  className="submit-project-btn"
                >
                  <Plus size={18} />
                  Submit Your First Project
                </button>
              )}

            </div>
          )}

      </div>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div
          className="project-modal-overlay"
          onClick={() => setSelectedProject(null)}
        >

          <div
            className="project-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
            >
              <X size={22} />
            </button>

            <div className="project-modal-icon">
              <GitBranch size={26} />
            </div>

            <h2>
              {getProjectName(selectedProject)}
            </h2>

            <p className="modal-hackathon">
              {getHackathonName(selectedProject)}
            </p>

            <div className="modal-section">

              <h3>Team</h3>

              <p>
                <Users size={16} />
                {getTeamName(selectedProject)}
              </p>

            </div>

            <div className="modal-section">

              <h3>Description</h3>

              <p>
                {getDescription(selectedProject)}
              </p>

            </div>

            {getTechnologies(selectedProject).length >
              0 && (
              <div className="modal-section">

                <h3>Technologies</h3>

                <div className="technology-list">
                  {getTechnologies(selectedProject).map(
                    (technology, index) => (
                      <span
                        className="technology-tag"
                        key={`${technology}-${index}`}
                      >
                        {technology}
                      </span>
                    )
                  )}
                </div>

              </div>
            )}

            <div className="modal-section">

              <h3>Status</h3>

              <p>
                {getStatus(selectedProject) ===
                "submitted"
                  ? "Submitted"
                  : "Draft"}
              </p>

            </div>

            <div className="modal-links">

              {getGithubUrl(selectedProject) && (
                <a
                  href={getGithubUrl(selectedProject)}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-link"
                >
                  <GitBranch size={18} />
                  GitHub Repository
                </a>
              )}

              {getDemoUrl(selectedProject) && (
                <a
                  href={getDemoUrl(selectedProject)}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-link"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default Projects;