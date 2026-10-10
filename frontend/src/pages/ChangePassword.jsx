
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
        const token = localStorage.getItem("hackhub_token");

        if (!token) {
            setMessage("Please log in again.");
            return;
        }

        const response = await fetch(
            "http://localhost:5000/api/auth/change-password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            }
        );

        const data = await response.json();

        setMessage(data.message || "Request completed.");

        if (response.ok) {
            setCurrentPassword("");
            setNewPassword("");
        }
    } catch (error) {
        console.error("Change password error:", error);
        setMessage("Cannot connect to the backend.");
    }
};
  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "24px" }}>
      <h1>Change Password</h1>

      <form onSubmit={handleSubmit}>
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
        />

        <button type="submit">Update Password</button>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{ marginLeft: "8px" }}
        >
          Cancel
        </button>
      </form>

      {message && <p role="alert">{message}</p>}
    </div>
  );
}

export default ChangePassword;