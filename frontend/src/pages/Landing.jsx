

import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Trophy,
  Users,
  Lightbulb,
  Code2,
  Rocket,
  Target,
} from "lucide-react";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-icon">
            <Code2 size={23} />
          </div>
          <span>HackHub</span>
        </div>

        <div className="landing-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="landing-nav-actions">
          <button
            className="login-btn"
            onClick={() => navigate("/dashboard")}
          >
            Login
          </button>
          <button
            className="get-started-btn"
            onClick={() => navigate("/dashboard")}
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" id="home">
        <div className="hero-content">
          <div className="hero-tag">
            <Rocket size={15} />
            <span>BUILD. INNOVATE. COMPETE.</span>
          </div>

          <h1>
            Turn Your Ideas
            <br />
            Into <span>Innovation.</span>
          </h1>

          <p>
            Discover hackathons, collaborate with talented
            people, showcase your projects and bring your
            ideas to life with HackHub.
          </p>

          <div className="hero-actions">
            <button
              className="primary-hero-btn"
              onClick={() => navigate("/dashboard")}
            >
              Explore Hackathons
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-hero-btn"
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </button>
          </div>

          <div className="hero-note">
            <span className="note-dot"></span>
            One platform for hackathon participation
            and project evaluation
          </div>
        </div>

        {/* Illustration */}
        <div className="hero-visual">
          <div className="visual-glow"></div>

          <div className="visual-card">
            <div className="visual-card-header">
              <div>
                <span className="visual-label">HACKHUB</span>
                <h3>Innovation starts here</h3>
              </div>
              <div className="visual-icon">
                <Lightbulb size={24} />
              </div>
            </div>

            <div className="visual-divider"></div>

            <div className="visual-feature">
              <div className="feature-icon purple">
                <Trophy size={20} />
              </div>
              <div>
                <strong>Compete</strong>
                <span>Take part in hackathons</span>
              </div>
            </div>

            <div className="visual-feature">
              <div className="feature-icon blue">
                <Users size={20} />
              </div>
              <div>
                <strong>Collaborate</strong>
                <span>Build ideas with teams</span>
              </div>
            </div>

            <div className="visual-feature">
              <div className="feature-icon green">
                <Target size={20} />
              </div>
              <div>
                <strong>Get evaluated</strong>
                <span>Showcase your projects</span>
              </div>
            </div>

            <div className="visual-bottom">
              <span>YOUR NEXT IDEA STARTS HERE</span>
              <ArrowRight size={18} />
            </div>
          </div>

          <div className="floating-badge">
            <Trophy size={18} />
            <span>Think. Build. Win.</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div className="section-heading">
          <span className="section-tag">WHAT WE OFFER</span>
          <h2>Everything you need to innovate</h2>
          <p>
            A unified platform for participants, teams
            and hackathon judges.
          </p>
        </div>

        <div className="feature-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon purple">
              <Trophy size={24} />
            </div>
            <h3>Explore Hackathons</h3>
            <p>
              Discover hackathons and explore opportunities
              to turn your ideas into projects.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon blue">
              <Users size={24} />
            </div>
            <h3>Team Collaboration</h3>
            <p>
              Work together with your teammates and
              develop innovative solutions.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon green">
              <Code2 size={24} />
            </div>
            <h3>Project Submission</h3>
            <p>
              Submit project details and showcase
              your team's work.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon orange">
              <Target size={24} />
            </div>
            <h3>Judging & Rankings</h3>
            <p>
              Evaluate projects using judging criteria
              and view competition rankings.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="landing-about" id="about">
        <div>
          <span className="section-tag">ABOUT HACKHUB</span>
          <h2>Ideas deserve a place to grow.</h2>
          <p>
            HackHub brings hackathon activities together
            in one platform, from discovering events to
            submitting and evaluating projects.
          </p>
        </div>

        <button
          className="primary-hero-btn"
          onClick={() => navigate("/dashboard")}
        >
          Get Started <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-logo">
          <div className="logo-icon">
            <Code2 size={21} />
          </div>
          <span>HackHub</span>
        </div>
        <span>Build ideas. Create impact.</span>
        <span>© 2026 HackHub</span>
      </footer>
    </div>
  );
}

export default Landing;