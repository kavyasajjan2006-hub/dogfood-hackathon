import Hackathons from "./Hackathons.jsx";
import { useState } from "react";
import {
  Users,
  FolderKanban,
  Trophy,
  ClipboardCheck,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";

function Dashboard() {
  const [active, setActive] = useState("Overview");
  const [search, setSearch] = useState("");

  const stats = [
    {
      title: "Total Participants",
      value: "1,240",
      icon: Users,
      change: "+12% this month",
    },
    {
      title: "Total Projects",
      value: "186",
      icon: FolderKanban,
      change: "+8% this month",
    },
    {
      title: "Active Hackathons",
      value: "12",
      icon: Trophy,
      change: "3 starting soon",
    },
    {
      title: "Pending Reviews",
      value: "24",
      icon: ClipboardCheck,
      change: "Needs attention",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Smart Traffic System",
      description: "AI-powered traffic monitoring and congestion prediction.",
      team: "Team Innovators",
      status: "Under Review",
    },
    {
      id: 2,
      name: "HealthConnect",
      description: "A platform to connect patients with healthcare services.",
      team: "Code Crafters",
      status: "Approved",
    },
    {
      id: 3,
      name: "Green Energy Tracker",
      description: "Monitor renewable energy usage and carbon savings.",
      team: "EcoTech",
      status: "Pending",
    },
  ];

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.team} ${project.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleView(project) {
    alert(`Selected project: ${project.name}`);
  }

  return (
    <div className="app-layout">
      <Sidebar active={active} setActive={setActive} />

      <main className="main-content">
        <Navbar
          active={active}
          search={search}
          setSearch={setSearch}
        />
        {active === "Hackathons" ? (
  <Hackathons />
) : (
        <div className="dashboard-content">
          <div className="page-heading">
            <div>
              <h1>Overview</h1>
              <p>Here's what's happening in your workspace.</p>
            </div>

            <button className="add-button">
              <Plus size={18} />
              Create Hackathon
            </button>
          </div>

          <section className="stats-grid">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
              />
            ))}
          </section>

          <section className="projects-section">
            <div className="section-heading">
              <div>
                <h2>Recent Projects</h2>
                <p>Recently submitted projects</p>
              </div>

              <button className="view-all">
                View all <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="projects-grid">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={handleView}
                  />
                ))
              ) : (
                <p>No matching projects found.</p>
              )}
            </div>
          </section>
        </div>
)}
      </main>

    </div>
  );
}

export default Dashboard;