import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "./config";
import "./search.css";
import Dashboard from "./dashboard.js";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const word = query.trim().split(" ")[0];
    if (!word) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/search?q=${word}`);
      setResults(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Optional: search on typing with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <>
      <input
        className="search-box"
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="search-results">
        {results.map((user) => (
          <Link
            key={user._id}
            to={`/user/${user.username}`}
            className="users"
            onClick={() => setResults([])}
          >
            <div>
              {user.firstName} {user.lastName}
            </div>{" "}
            <div className="username">@{user.username}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
