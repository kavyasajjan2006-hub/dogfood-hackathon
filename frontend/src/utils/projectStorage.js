
const STORAGE_KEY = "hackhub_projects";

// Get all saved projects
export function getProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Unable to load projects:", error);
    return [];
  }
}

// Save all projects
export function saveProjects(projects) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );
}

// Add a new project
export function addProject(project) {
  const projects = getProjects();

  const newProject = {
    ...project,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  saveProjects([...projects, newProject]);

  return newProject;
}

const EVALUATION_KEY = "hackhub_evaluations";

export function getEvaluations() {
  try {
    const saved = localStorage.getItem(EVALUATION_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Unable to load evaluations:", error);
    return {};
  }
}

export function saveEvaluations(evaluations) {
  localStorage.setItem(
    EVALUATION_KEY,
    JSON.stringify(evaluations)
  );
}