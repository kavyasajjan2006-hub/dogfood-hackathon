import { getProjects } from "../utils/projectStorage";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  FolderOpen,
  Search,
  Users,
  X,
} from "lucide-react";
import "./Projects.css";

const sampleProjects = [
  {
    id: 1,
    name: "Smart Waste Management",
    team: "EcoTech",
    hackathon: "Green Tech Challenge",
    description:
      "An intelligent waste management system that helps monitor waste collection and improve recycling through technology.",
    technologies: ["React", "Python", "MySQL"],
    github: "https://github.com/",
    demo: "",
    members: ["Aarav", "Priya", "Rahul"],
  },
  {
    id: 2,
    name: "AI Health Assistant",
    team: "Innovators",
    hackathon: "AI Innovation Challenge",
    description:
      "An AI-powered assistant that provides general health information and helps users understand common health concerns.",
    technologies: ["React", "Python", "Machine Learning"],
    github: "https://github.com/",
    demo: "",
    members: ["Ananya", "Kiran"],
  },
  {
    id: 3,
    name: "Smart City Traffic Monitor",
    team: "CodeStorm",
    hackathon: "Smart City Hackathon",
    description:
      "A traffic monitoring application that uses computer vision to analyze traffic flow and help identify congestion.",
    technologies: ["Python", "OpenCV", "React"],
    github: "https://github.com/",
    demo: "",
    members: ["Vikram", "Meera", "Rohan"],
  },
  {
    id: 4,
    name: "Green Energy Tracker",
    team: "Future Builders",
    hackathon: "Green Tech Challenge",
    description:
      "A web application for monitoring renewable energy usage and visualizing energy consumption trends.",
    technologies: ["React", "Node.js", "MySQL"],
    github: "https://github.com/",
    demo: "",
    members: ["Diya", "Arjun"],
  },
  {
    id: 5,
    name: "AI Study Companion",
    team: "Tech Minds",
    hackathon: "AI Innovation Challenge",
    description:
      "A learning application that helps students organize study materials and get AI-assisted explanations.",
    technologies: ["React", "Python", "AI"],
    github: "https://github.com/",
    demo: "",
    members: ["Neha", "Aditya", "Sana"],
  },
  {
    id: 6,
    name: "Smart Parking System",
    team: "Byte Builders",
    hackathon: "Smart City Hackathon",
    description:
      "A smart parking concept that helps users find available parking spaces and view parking information.",
    technologies: ["Python", "IoT", "React"],
    github: "https://github.com/",
    demo: "",
    members: ["Ravi", "Sneha"],
  },
];

function Projects() {
  const navigate = useNavigate();
  const [submittedProjects] = useState(() =>
  getProjects().map((project) => ({
    ...project,
    name: project.projectName || project.name || "Untitled Project",
    team: project.teamName || project.team || "Unknown Team",
    github: project.githubUrl || project.github || "",
    demo: project.demoUrl || project.demo || "",
    members: Array.isArray(project.teamMembers)
      ? project.teamMembers
      : typeof project.teamMembers === "string"
        ? project.teamMembers.split(",").map((m) => m.trim()).filter(Boolean)
        : project.members || [],
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === "string"
        ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
  }))
);

const allProjects = [...submittedProjects, ...sampleProjects];

  const [search, setSearch] = useState("");
  const [hackathon, setHackathon] = useState("All");
  const [technology, setTechnology] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
const hackathons = [
  "All",
  ...new Set(allProjects.map((p) => p.hackathon).filter(Boolean)),
];

const technologies = [
  "All",
  ...new Set(allProjects.flatMap((p) => p.technologies)),
];

  const filteredProjects = useMemo(() => {
  return allProjects.filter((project) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      project.name.toLowerCase().includes(query) ||
      project.team.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query);

    const matchesHackathon =
      hackathon === "All" || project.hackathon === hackathon;

    const matchesTechnology =
      technology === "All" ||
      project.technologies.includes(technology);

    return (
      matchesSearch &&
      matchesHackathon &&
      matchesTechnology
    );
  });
}, [search, hackathon, technology, allProjects.length]);
  const clearFilters = () => {
    setSearch("");
    setHackathon("All");
    setTechnology("All");
  };

  return (
    <div className="projects-page">
      <div className="projects-container">
        <button
          className="projects-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="projects-heading">
          <div>
            <div className="projects-title-row">
              <div className="projects-title-icon">
                <FolderOpen size={24} />
              </div>
              <h1>Explore Projects</h1>
            </div>
            <p>
              Discover innovative ideas and projects built by
              hackathon teams.
            </p>
          </div>

          <button
            className="projects-submit-btn"
            onClick={() => navigate("/submit-project")}
          >
            Submit Project
          </button>
        </div>

        <div className="projects-toolbar">
          <div className="projects-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects or teams..."
            />
          </div>

          <div className="projects-filter">
            <label htmlFor="hackathon-filter">Hackathon</label>
            <select
              id="hackathon-filter"
              value={hackathon}
              onChange={(e) => setHackathon(e.target.value)}
            >
              {hackathons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="projects-filter">
            <label htmlFor="technology-filter">Technology</label>
            <select
              id="technology-filter"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
            >
              {technologies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            className="projects-clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>

        <div className="projects-results">
          <span>
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"} found
          </span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card-top">
                  <div className="project-card-icon">
                    <Code2 size={22} />
                  </div>
                  <span className="project-hackathon">
                    {project.hackathon}
                  </span>
                </div>

                <h2>{project.name}</h2>
                <p className="project-team">
                  <Users size={15} />
                  {project.team}
                </p>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="project-technologies">
                  {project.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-card-footer">
                  <button
                    className="project-details-btn"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Details
                  </button>

                  {project.github && (
                    <a
                      className="project-link-btn"
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub for ${project.name}`}
                    >
                      <ExternalLink size={17} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="projects-empty">
            <FolderOpen size={38} />
            <h2>No projects found</h2>
            <p>Try changing your search or filters.</p>
            <button onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </div>

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="project-modal-header">
              <div>
                <span className="project-hackathon">
                  {selectedProject.hackathon}
                </span>
                <h2 id="project-modal-title">
                  {selectedProject.name}
                </h2>
              </div>
              <button
                className="project-modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
              >
                <X size={21} />
              </button>
            </div>

            <div className="project-modal-body">
              <p className="project-modal-team">
                <Users size={17} />
                {selectedProject.team}
              </p>

              <h3>About the project</h3>
              <p>{selectedProject.description}</p>

              <h3>Technologies</h3>
              <div className="project-technologies">
                {selectedProject.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <h3>Team members</h3>
              <p>{selectedProject.members.join(", ")}</p>

              <div className="project-modal-links">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Repository <ExternalLink size={15} />
                  </a>
                )}

                {selectedProject.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;