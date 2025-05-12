import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Dashboard from "./dashboard.js";
import Settings from "./settings.js";
import Signup from "./signup.js";
import Login from "./login.js";
import "./App.css";
import { useAuth } from "./AuthContext";
import icon from "./icon.png";
import Search from "./search.js";

function App() {
  const { accessToken, username } = useAuth();
  return (
    <Router>
      {!accessToken ? (
        <>
          <nav className="nav-bar">
            <a className="site-name-container" href="/">
              <img className="site-icon" src={icon}></img>
              <div className="site-name">
                CPinfo
                <p className="site-slogan">Code. Compete. Conquer</p>
              </div>
            </a>
            <div className="nav-button-container">
              <Search />
              <Link className="nav-buttons" to="/signup">
                Sign-Up
              </Link>{" "}
              |
              <Link className="nav-buttons" to="/login">
                Login
              </Link>
            </div>
          </nav>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user/:username" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </>
      ) : (
        <>
          <nav className="nav-bar">
            <a className="site-name-container" href="/">
              <img className="site-icon" src={icon}></img>
              <div className="site-name">
                CPinfo
                <p className="site-slogan">Code. Compete. Conquer</p>
              </div>
            </a>
            <div className="nav-button-container">
              <Search />
              <Link className="nav-buttons" to={`/`}>
                {username}
              </Link>{" "}
              |{" "}
              <Link className="nav-buttons" to={`/settings`}>
                Settings
              </Link>
            </div>
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
