
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

console.log("Login status:", response.status);
console.log("Login response:", data);

if (!response.ok) {
  setMessage(data.message || data.error || `Login failed (${response.status}).`);
  return;
}

if (!data.token) {
  setMessage("Backend login succeeded, but no token was returned.");
  return;
}

localStorage.setItem("hackhub_token", data.token);
localStorage.setItem("hackhub_user", JSON.stringify(data.user ?? {}));

console.log(
  "Token saved:",
  Boolean(localStorage.getItem("hackhub_token"))
);

navigate("/dashboard");
    } catch (error) {
      setMessage("Cannot connect to the backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "24px" }}>
      <h1>Login to HackHub</h1>
      <p>Enter your registered account details.</p>

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
