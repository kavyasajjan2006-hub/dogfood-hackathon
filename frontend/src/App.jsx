
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SubmitProject from "./pages/SubmitProject.jsx";
import Projects from "./pages/Projects.jsx";
import Judging from "./pages/Judging.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-project" element={<SubmitProject />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/judging" element={<Judging />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;