
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function CreateHackathon() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.end_date < form.start_date) {
      setError("End date must be on or after the start date.");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/hackathons", {
        method: "POST",
        body: JSON.stringify(form),
      });

      navigate("/hackathons");
    } catch (err) {
      setError(err.message || "Could not create hackathon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 650, margin: "40px auto", padding: 24 }}>
      <h1>Create Hackathon</h1>
      <p>Enter the details for your new hackathon.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Hackathon title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          maxLength={150}
          style={{ display: "block", width: "100%", margin: "8px 0 20px" }}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={5}
          style={{ display: "block", width: "100%", margin: "8px 0 20px" }}
        />

        <label htmlFor="start_date">Start date</label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "8px 0 20px" }}
        />

        <label htmlFor="end_date">End date</label>
        <input
          id="end_date"
          name="end_date"
          type="date"
          value={form.end_date}
          onChange={handleChange}
          min={form.start_date || undefined}
          required
          style={{ display: "block", margin: "8px 0 20px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Hackathon"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}
