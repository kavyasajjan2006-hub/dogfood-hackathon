
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { apiRequest } from "../utils/api";

function Hackathons() {
  const navigate = useNavigate();

  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [user] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("hackhub_user") || "{}"
      );
    } catch {
      return {};
    }
  });

  const isAdmin = user.role === "admin";

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    submission_deadline: "",
  });

  async function loadHackathons() {
    try {
      setError("");
      const data = await apiRequest("/hackathons");
      setHackathons(data.hackathons || []);
    } catch (err) {
      setError(err.message || "Unable to load hackathons");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHackathons();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await apiRequest("/hackathons", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage("Hackathon created successfully!");
      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        submission_deadline: "",
      });
      setShowForm(false);

      await loadHackathons();
    } catch (err) {
      setError(err.message || "Failed to create hackathon");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Hackathons</h1>
<p>Create and manage hackathon events, track submissions, and inspire innovation.</p>
        </div>

        {isAdmin && (
  <button
    type="button"
    onClick={() => {
      alert("Create Hackathon button is working!");
      setShowForm(true);
      setError("");
      setMessage("");
    }}
  >
    + Create Hackathon
  </button>
)}
      </div>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit}>
          <h2>Create a Hackathon</h2>

          <label htmlFor="name">Hackathon name *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label htmlFor="start_date">Start date</label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
          />

          <label htmlFor="end_date">End date</label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
          />

          <label htmlFor="submission_deadline">
            Submission deadline
          </label>
          <input
            id="submission_deadline"
            name="submission_deadline"
            type="date"
            value={form.submission_deadline}
            onChange={handleChange}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Submit Hackathon"}
          </button>
        </form>
      )}

      {loading && <p>Loading hackathons...</p>}

      {!loading && !error && hackathons.length === 0 && (
        <p>No hackathons found. Create one to get started.</p>
      )}

      {!loading && (
        <div className="hackathon-grid">
          {hackathons.map((hackathon) => (
            <div className="hackathon-card" key={hackathon.id}>
              <div className="hackathon-card-top">
                <div className="project-icon">
                  <CalendarDays size={20} />
                </div>
              </div>

              <h3>{hackathon.name}</h3>

              <p className="hackathon-theme">
                {hackathon.description || "Hackathon event"}
              </p>

              <div className="hackathon-detail">
                <CalendarDays size={16} />
                <span>
                  {hackathon.start_date || "Date not set"}
                  {hackathon.end_date
                    ? ` – ${hackathon.end_date}`
                    : ""}
                </span>
              </div>

              <button
                className="project-view"
                onClick={() =>
                  navigate(
                    `/leaderboard?hackathon_id=${encodeURIComponent(
                      hackathon.id
                    )}`
                  )
                }
              >
                View leaderboard <ArrowUpRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hackathons;
