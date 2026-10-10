
const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("hackhub_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function apiRequest(endpoint, options = {}) {
  return request(endpoint, options);
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getHackathons() {
  return request("/hackathons");
}

export async function getHackathon(id) {
  return request(`/hackathons/${id}`);
}

export async function getProjects() {
  return request("/projects");
}

export async function getProject(id) {
  return request(`/projects/${id}`);
}

export async function createProject(project, token) {
  return request("/projects", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(project),
  });
}

export async function submitProject(id, token) {
  return request(`/projects/${id}/submit`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getLeaderboard(hackathonId) {
  return request(`/leaderboard/${hackathonId}`);
}

export async function getCriteria(hackathonId, token) {
  return request(`/judging/criteria/${hackathonId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getMyAssignments(token) {
  return request("/judging/my-assignments", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function submitReview(projectId, review, token) {
  return request(`/judging/review/${projectId}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(review),
  });
}

export async function getMyReviews(token) {
  return request("/judging/my-reviews", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
