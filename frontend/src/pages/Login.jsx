
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(
          data.message || data.error || "Login failed. Check your credentials."
        );
        return;
      }

      if (!data.token || !data.user) {
        setMessage("The server did not return the required login information.");
        return;
      }

      const user = data.user;

      if (!["admin", "judge", "participant"].includes(user.role)) {
        setMessage("Your account role is missing or invalid. Contact the administrator.");
        return;
      }

      // Save the authenticated session.
      localStorage.setItem("hackhub_token", data.token);
      localStorage.setItem("hackhub_user", JSON.stringify(user));

      // Redirect according to role.
      // Only use an intended destination if one was provided.
      const requestedPath = location.state?.from?.pathname;

      if (user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else if (user.role === "judge") {
        navigate(requestedPath || "/judging", { replace: true });
      } else {
        navigate(requestedPath || "/dashboard", { replace: true });
      }
    } catch (error) {
      setMessage("Cannot connect to the backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "24px" }}>
      <h1>Login to HackHub</h1>
      <p>Sign in using your registered account.</p>

      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="username"
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "8px 0 16px",
          }}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "8px 0 16px",
          }}
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
