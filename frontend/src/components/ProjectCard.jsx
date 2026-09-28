
import { FolderKanban, ArrowUpRight } from "lucide-react";

function ProjectCard({ project, onView }) {
  return (
    <div className="project-card">
      <div className="project-card-top">
        <div className="project-icon">
          <FolderKanban size={20} />
        </div>

        <span
          className={`project-status ${project.status
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {project.status}
        </span>
      </div>

      <h3>{project.name}</h3>
      <p className="project-description">
        {project.description}
      </p>

      <div className="project-team">
        <span>Team</span>
        <strong>{project.team}</strong>
      </div>

      <button
        className="project-view"
        onClick={() => onView?.(project)}
      >
        View project <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

export default ProjectCard;