import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Dashboard from "./dashboard.js";
import Settings from "./settings.js";
import Signin from "./signin.js";
import Login from "./login.js";
import { useAuth } from "./AuthContext";

function App() {
  const { accessToken, username } = useAuth();
  return (
    <Router>
      {!accessToken ? (
        <>
          <nav>
            <Link to="/signin">Sign-in</Link> | <Link to="/login">Login</Link>
          </nav>
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user/:username" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </>
      ) : (
        <>
          <nav>
            <Link to={`/`}>Dashboard</Link> |{" "}
            <Link to={`/settings`}>Settings</Link>
          </nav>
          <Routes>
            <Route path="/user/:username" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to={`/user/${username}`} />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
