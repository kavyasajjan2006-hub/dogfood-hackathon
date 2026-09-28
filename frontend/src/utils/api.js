const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });
}

export async function submitProject(id, token) {
  return request(`/projects/${id}/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getLeaderboard(hackathonId) {
  return request(`/leaderboard/${hackathonId}`);
}

export async function getCriteria(hackathonId, token) {
  return request(`/judging/criteria/${hackathonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMyAssignments(token) {
  return request("/judging/my-assignments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function submitReview(projectId, review, token) {
  return request(`/judging/review/${projectId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });
}

export async function getMyReviews(token) {
  return request("/judging/my-reviews", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}