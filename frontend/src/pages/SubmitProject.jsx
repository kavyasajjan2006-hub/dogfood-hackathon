import { addProject } from "../utils/projectStorage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Code2,
  
  ExternalLink,
  Send,
} from "lucide-react";
import "./SubmitProject.css";

function SubmitProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectName: "",
    hackathon: "",
    teamName: "",
    teamMembers: "",
    description: "",
    technologies: "",
    github: "",
    demo: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.projectName.trim()) {
      newErrors.projectName = "Project name is required.";
    }

    if (!form.hackathon) {
      newErrors.hackathon = "Please select a hackathon.";
    }

    if (!form.teamName.trim()) {
      newErrors.teamName = "Team name is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Project description is required.";
    } else if (form.description.trim().length < 30) {
      newErrors.description =
        "Please provide at least 30 characters.";
    }

    if (!form.technologies.trim()) {
      newErrors.technologies =
        "Enter at least one technology.";
    }

    const validUrl = (value) => {
      if (!value.trim()) return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    };

    if (!validUrl(form.github)) {
      newErrors.github = "Enter a valid URL.";
    }

    if (!validUrl(form.demo)) {
      newErrors.demo = "Enter a valid URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) return;

  addProject({
    projectName: formData.projectName,
    hackathon: formData.hackathon,
    teamName: formData.teamName,
    description: formData.description,
    technologies: formData.technologies,
    teamMembers: formData.teamMembers,
    githubUrl: formData.githubUrl,
    demoUrl: formData.demoUrl,
  });

  setSubmitted(true);
};

  const resetForm = () => {
    setForm({
      projectName: "",
      hackathon: "",
      teamName: "",
      teamMembers: "",
      description: "",
      technologies: "",
      github: "",
      demo: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="submit-page">
        <div className="submit-success">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          <h1>Project submitted!</h1>
          <p>
            Your project details have passed the form
            validation. Database submission will be
            available after backend integration.
          </p>

          <div className="success-summary">
            <span>Project name</span>
            <strong>{form.projectName}</strong>
            <span>Hackathon</span>
            <strong>{form.hackathon}</strong>
            <span>Team</span>
            <strong>{form.teamName}</strong>
          </div>

          <div className="success-actions">
            <button
              className="submit-primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard <ArrowRight size={17} />
            </button>
            <button
              className="submit-secondary-btn"
              onClick={resetForm}
            >
              Submit another project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <div className="submit-container">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} /> Back to Dashboard
        </button>

        <div className="submit-heading">
          <div className="submit-heading-icon">
            <Code2 size={25} />
          </div>
          <div>
            <h1>Submit Your Project</h1>
            <p>
              Share your idea, showcase your work and
              submit your project for evaluation.
            </p>
          </div>
        </div>

        <form className="submit-form" onSubmit={handleSubmit}>
          {/* Project information */}
          <section className="form-section">
            <div className="form-section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>Project Information</h2>
                <p>Tell us about your project.</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="projectName">
                Project Name <span>*</span>
              </label>
              <input
                id="projectName"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="e.g. Smart Waste Management"
              />
              {errors.projectName && (
                <small className="field-error">
                  {errors.projectName}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="hackathon">
                Select Hackathon <span>*</span>
              </label>
              <select
                id="hackathon"
                name="hackathon"
                value={form.hackathon}
                onChange={handleChange}
              >
                <option value="">Choose a hackathon</option>
                <option value="AI Innovation Challenge">
                  AI Innovation Challenge
                </option>
                <option value="Smart City Hackathon">
                  Smart City Hackathon
                </option>
                <option value="Green Tech Challenge">
                  Green Tech Challenge
                </option>
              </select>
              {errors.hackathon && (
                <small className="field-error">
                  {errors.hackathon}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="description">
                Project Description <span>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain the problem, your solution and how your project works..."
              />
              <div className="field-footer">
                {errors.description ? (
                  <small className="field-error">
                    {errors.description}
                  </small>
                ) : (
                  <small>
                    Minimum 30 characters
                  </small>
                )}
                <small>
                  {form.description.length} characters
                </small>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="technologies">
                Technologies Used <span>*</span>
              </label>
              <input
                id="technologies"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="e.g. React, Python, MySQL"
              />
              {errors.technologies && (
                <small className="field-error">
                  {errors.technologies}
                </small>
              )}
              <small className="field-hint">
                Separate technologies with commas.
              </small>
            </div>
          </section>

          {/* Team details */}
          <section className="form-section">
            <div className="form-section-heading">
              <span className="section-number">02</span>
              <div>
                <h2>Team Details</h2>
                <p>Provide your team's information.</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="teamName">
                Team Name <span>*</span>
              </label>
              <input
                id="teamName"
                name="teamName"
                value={form.teamName}
                onChange={handleChange}
                placeholder="Enter your team name"
              />
              {errors.teamName && (
                <small className="field-error">
                  {errors.teamName}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="teamMembers">
                Team Members
              </label>
              <textarea
                id="teamMembers"
                name="teamMembers"
                rows="3"
                value={form.teamMembers}
                onChange={handleChange}
                placeholder="Enter team member names, separated by commas"
              />
              <small className="field-hint">
                Optional for now. Team registration can be
                connected to the backend later.
              </small>
            </div>
          </section>

          {/* Project links */}
          <section className="form-section">
            <div className="form-section-heading">
              <span className="section-number">03</span>
              <div>
                <h2>Project Links</h2>
                <p>
                  Share your source code and working demo.
                </p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="github">
                 <Code2 size={16} /> GitHub Repository
            </label>
              <input
                id="github"
                name="github"
                type="url"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
              />
              {errors.github && (
                <small className="field-error">
                  {errors.github}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="demo">
                <ExternalLink size={16} /> Live Demo
              </label>
              <input
                id="demo"
                name="demo"
                type="url"
                value={form.demo}
                onChange={handleChange}
                placeholder="https://your-project.com"
              />
              {errors.demo && (
                <small className="field-error">
                  {errors.demo}
                </small>
              )}
            </div>
          </section>

          <div className="submit-form-footer">
            <span>
              <span className="required-star">*</span>
              Required fields
            </span>
            <button type="submit" className="submit-primary-btn">
              Submit Project <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitProject;