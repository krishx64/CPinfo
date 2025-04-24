import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "./config";

export default function Signin() {
  const [userCredentials, setUserCredentials] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({}); // State to track validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update user credentials
    setUserCredentials({ ...userCredentials, [name]: value });

    // Validate the field
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required.";
        } else if (/\d/.test(value)) {
          error = "First name cannot contain numbers.";
        } else if (/\s/.test(value)) {
          error = "First name cannot contain spaces.";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required.";
        } else if (/\d/.test(value)) {
          error = "Last name cannot contain numbers.";
        } else if (/\s/.test(value)) {
          error = "Last name cannot contain spaces.";
        }
        break;

      case "username":
        if (!value.trim()) {
          error = "Username is required.";
        } else if (/\s/.test(value)) {
          error = "Username cannot contain spaces.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Invalid email address.";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Password must be at least 6 characters.";
        }
        break;
      case "confirmPassword":
        if (value !== userCredentials.password) {
          error = "Passwords do not match.";
        }
        break;
      default:
        break;
    }

    // Update errors state
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(userCredentials).forEach((key) => {
      validateField(key, userCredentials[key]);
      if (!userCredentials[key].trim()) {
        newErrors[key] = `${key} is required.`;
      }
    });

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length === 0) {
      // Submit the form
      axios
        .post(`${BASE_URL}/api/signin`, userCredentials)
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          alert("Sign-in successful!");
        })
        .catch((error) => {
          console.error("Error submitting form:", error.message);
          alert("Error submitting form. Please try again.");
        });
    }
  };

  return (
    <div>
      <form className="My-form" onSubmit={handleSubmit}>
        <div>
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            value={userCredentials.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div>
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            value={userCredentials.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={userCredentials.username.toLowerCase()}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userCredentials.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userCredentials.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userCredentials.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>
        <button type="submit">Sign-in</button>
      </form>
    </div>
  );
}
