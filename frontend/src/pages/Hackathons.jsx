
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ArrowUpRight,
  Plus,
  X,
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

      const list = Array.isArray(data)
        ? data
        : data?.hackathons || data?.data || [];

      setHackathons(list);
    } catch (err) {
      setError(err.message || "Unable to load hackathons.");
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

    if (!isAdmin) {
      setError("Only administrators can create hackathons.");
      return;
    }

    if (
      form.start_date &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      setError("The end date cannot be before the start date.");
      return;
    }

    if (
      form.submission_deadline &&
      form.start_date &&
      form.submission_deadline < form.start_date
    ) {
      setError("The submission deadline cannot be before the start date.");
      return;
    }

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
      setError(err.message || "Failed to create hackathon.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Hackathons</h1>
          <p>
            Discover hackathons, explore projects, and inspire innovation.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setShowForm((previous) => !previous);
              setError("");
              setMessage("");
            }}
          >
            {showForm ? (
              <>
                <X size={17} /> Cancel
              </>
            ) : (
              <>
                <Plus size={17} /> Create Hackathon
              </>
            )}
          </button>
        )}
      </div>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit}>
          <h2>Create a Hackathon</h2>

          <label htmlFor="hackathon-name">Hackathon name *</label>
          <input
            id="hackathon-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={150}
          />

          <label htmlFor="hackathon-description">Description</label>
          <textarea
            id="hackathon-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />

          <label htmlFor="hackathon-start">Start date</label>
          <input
            id="hackathon-start"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
          />

          <label htmlFor="hackathon-end">End date</label>
          <input
            id="hackathon-end"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
          />

          <label htmlFor="hackathon-deadline">
            Submission deadline
          </label>
          <input
            id="hackathon-deadline"
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
        <p>No hackathons found yet.</p>
      )}

      {!loading && hackathons.length > 0 && (
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

              {hackathon.submission_deadline && (
                <p>
                  Submission deadline: {hackathon.submission_deadline}
                </p>
              )}

              <button
                className="project-view"
                type="button"
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
