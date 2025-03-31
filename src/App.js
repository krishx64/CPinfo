import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./dashboard.js";
import Settings from "./settings.js";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/settings">Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
