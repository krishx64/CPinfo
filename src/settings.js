import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import BASE_URL from "./config";

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
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting form. Please try again.");
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
    <div>
      <form className="My-Form" onSubmit={handleSubmit}>
        <div>
          <label>
            Enter Codeforces handle:
            <input
              type="text"
              name="cf"
              value={handleName.cf}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Enter Atcoder handle:
            <input
              type="text"
              name="ac"
              value={handleName.ac}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Enter Leetcode handle:
            <input
              type="text"
              name="lc"
              value={handleName.lc}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Enter Codechef handle:
            <input
              type="text"
              name="cc"
              value={handleName.cc}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
