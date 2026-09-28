
import { Search, Bell } from "lucide-react";

function Navbar({ active, search, setSearch }) {
  return (
    <header className="navbar">
      <div className="breadcrumb">
        Workspace <span>/</span> {active}
      </div>

      <div className="navbar-actions">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="notification"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;