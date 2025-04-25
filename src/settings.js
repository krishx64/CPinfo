import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import BASE_URL from "./config";
import "./login.css";
import { Toast, displayMsg } from "./toast.js";

export default function Settings() {
  const [resources, setResources] = useState([]);
  const [handleName, setHandleName] = useState({
    cf: "",
    cc: "",
    ac: "",
    lc: "",
  });
  const { accessToken, username, setAccessToken, setUsername } = useAuth();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/resources/${username}`)
      .then((response) => setResources(response.data.userStats || []))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHandleName({ ...handleName, [name]: value.toLowerCase() });
  };
  useEffect(() => {
    let newHandleName = { ...handleName };
    resources.forEach((resource) => {
      if (resource.platform === "Atcoder") {
        newHandleName.ac = resource.handle;
      }
      if (resource.platform === "Codeforces") {
        newHandleName.cf = resource.handle;
      }
      if (resource.platform === "Codechef") {
        newHandleName.cc = resource.handle;
      }
      if (resource.platform === "Leetcode") {
        newHandleName.lc = resource.handle;
      }
    });
    setHandleName(newHandleName);
  }, [resources]);
  async function fetchWithAuth(url, options = {}) {
    // Add Authorization header with access token
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    let res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // important for cookies (refreshToken)
    });

    if (res.status === 401) {
      // Token might be expired — try to refresh it
      const tokenRes = await fetch(`${BASE_URL}/api/token`, {
        method: "POST",
        credentials: "include", // send refreshToken cookie
      });

      if (tokenRes.ok) {
        const data = await tokenRes.json();
        const newAccessToken = data.accessToken;
        const newUsername = data.username;

        setAccessToken(newAccessToken); // update in context or state
        setUsername(newUsername);

        // Retry original request with new token
        res = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
          credentials: "include",
        });
      } else {
        throw new Error("Session expired. Please log in again.");
      }
    }

    return res;
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await fetchWithAuth(`${BASE_URL}/api/fetch`, {
        method: "POST",
        body: JSON.stringify(handleName),
      });
      console.log("Form submitted successfully:", response.data);
      displayMsg("Your Submissions Will Be Updated In 10 Minutes", "success");
    } catch (error) {
      console.error("Error submitting form:", error.message);
      displayMsg("Error submitting form. Please try again.", "error");
    }
  };
  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h1>Settings</h1>
      <form className="login-field" onSubmit={handleSubmit}>
        <div>
          <div className="input-text">Codeforces handle</div>
          <input
            className="input-field handle-field"
            type="text"
            name="cf"
            value={handleName.cf}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="input-text">Atcoder handle</div>
          <input
            className="input-field handle-field"
            type="text"
            name="ac"
            value={handleName.ac}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="input-text">Leetcode handle</div>
          <input
            className="input-field handle-field"
            type="text"
            name="lc"
            value={handleName.lc}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="input-text">Codechef handle</div>
          <input
            className="input-field handle-field"
            type="text"
            name="cc"
            value={handleName.cc}
            onChange={handleChange}
          />
        </div>
        <button className="authenticate-button" type="submit">
          Update
        </button>
      </form>
      <button
        className="authenticate-button logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
      <Toast />
    </div>
  );
}
