import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import BASE_URL from "./config";
import "./login.css";
import { Toast, displayMsg } from "./toast.js";

export default function Login() {
  const { setAccessToken, setUsername } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("TEST");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  useEffect(() => {
    validateForm();
  }, [credentials]);
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentials.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        setUsername(data.username);
      } else {
        const data = await res.json();
        displayMsg(data.message, "error");
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data?.message || error.message
      );
      displayMsg("Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-field">
        <div>
          <input
            placeholder="Enter email"
            className="input-field"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <input
            placeholder="Enter password"
            className="input-field"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button
          className="authenticate-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <Toast />
    </div>
  );
}
