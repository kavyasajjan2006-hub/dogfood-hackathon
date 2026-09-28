
import { Plus, CalendarDays, Users, ArrowUpRight } from "lucide-react";

const hackathons = [
  {
    id: 1,
    name: "AI Innovation Challenge",
    theme: "Artificial Intelligence",
    date: "October 15–17, 2026",
    participants: 120,
    status: "Upcoming",
  },
  {
    id: 2,
    name: "Smart City Hackathon",
    theme: "Smart Cities",
    date: "September 10–12, 2026",
    participants: 85,
    status: "Completed",
  },
  {
    id: 3,
    name: "Green Tech Challenge",
    theme: "Sustainability",
    date: "November 5–7, 2026",
    participants: 64,
    status: "Upcoming",
  },
];

function Hackathons() {
  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Hackathons</h1>
          <p>Manage and explore hackathon events.</p>
        </div>

        <button className="add-button">
          <Plus size={18} />
          Create Hackathon
        </button>
      </div>

      <div className="hackathon-grid">
        {hackathons.map((hackathon) => (
          <div className="hackathon-card" key={hackathon.id}>
            <div className="hackathon-card-top">
              <div className="project-icon">
                <CalendarDays size={20} />
              </div>
              <span
                className={`hackathon-status ${hackathon.status.toLowerCase()}`}
              >
                {hackathon.status}
              </span>
            </div>

            <h3>{hackathon.name}</h3>
            <p className="hackathon-theme">{hackathon.theme}</p>

            <div className="hackathon-detail">
              <CalendarDays size={16} />
              <span>{hackathon.date}</span>
            </div>

            <div className="hackathon-detail">
              <Users size={16} />
              <span>{hackathon.participants} participants</span>
            </div>

            <button className="project-view">
              View details <ArrowUpRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hackathons;