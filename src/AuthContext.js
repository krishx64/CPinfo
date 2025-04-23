import { createContext, useContext, useEffect, useState } from "react";
import BASE_URL from "./config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState(null);

  // Try to refresh token on initial load
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/token`, {
          method: "POST",
          credentials: "include", // Send cookies
        });

        if (res.ok) {
          const data = await res.json(); // { accessToken, username }
          setAccessToken(data.accessToken);
          setUsername(data.username);
        }
      } catch (err) {
        console.error("Failed to refresh token:", err);
      }
    };

    refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
