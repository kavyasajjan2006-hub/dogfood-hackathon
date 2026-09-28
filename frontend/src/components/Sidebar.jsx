
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  FolderKanban,
  ClipboardCheck,
  Medal,
  Code2,
} from "lucide-react";

const menuItems = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Hackathons", path: "/dashboard", icon: Trophy },
  { name: "Projects", path: "/projects", icon: FolderKanban },
{ name: "Judging", path: "/judging", icon: ClipboardCheck },
  { name: "Leaderboard", path: "/leaderboard", icon: Medal },
];

function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    setActive(item.name);
    navigate(item.path, {
      state: { active: item.name },
    });
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Code2 size={22} />
        </div>
        <span>HackHub</span>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav className="navigation">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <button
            key={name}
            className={`nav-item ${
              active === name ? "active" : ""
            }`}
            onClick={() => handleNavigation({ name, path })}
          >
            <Icon size={19} />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="profile">
          <div className="avatar">AD</div>
          <div className="profile-info">
            <strong>Admin User</strong>
            <span>Organizer</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;