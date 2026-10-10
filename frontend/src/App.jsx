
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Hackathons from "./pages/Hackathons.jsx";
import SubmitProject from "./pages/SubmitProject.jsx";
import Projects from "./pages/Projects.jsx";
import Judging from "./pages/Judging.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authentication required */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/submit-project" element={<SubmitProject />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/judging" element={<Judging />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Redirect unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
