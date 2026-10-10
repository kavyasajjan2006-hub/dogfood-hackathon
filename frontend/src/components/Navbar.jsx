import { useState } from "react";
import {
  Search,
  LogIn,
  LogOut,
  ChevronDown,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ active, search, setSearch }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("hackhub_token");
    localStorage.removeItem("hackhub_user");

    setDropdownOpen(false);
    navigate("/", { replace: true });
  };

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

        <div className="account-dropdown">
          <div className="account-actions">
            <button
              type="button"
              className="navbar-login"
              onClick={() => navigate("/login")}
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>

            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="Toggle account menu"
              aria-expanded={dropdownOpen}
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {dropdownOpen && (
            <div className="account-menu">
              <button
                type="button"
                className="change-password-option"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/change-password");
                }}
              >
                <KeyRound size={18} />
                <span>Change Password</span>
              </button>

              <button
                type="button"
                className="logout-option"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;