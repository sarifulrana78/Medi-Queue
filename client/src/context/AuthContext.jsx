import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import api from "../lib/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount / reload
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/auth/me");
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signUpEmail = async (name, email, password, photoUrl) => {
    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      });
      if (res.error) {
        throw new Error(res.error.message || "Failed to register user");
      }
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const signInEmail = async (email, password) => {
    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });
      if (res.error) {
        throw new Error(res.error.message || "Failed to sign in");
      }

      // Fetch the signed JWT token from the server
      const tokenRes = await api.get("/api/auth/jwt-token");
      const token = tokenRes.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      // Sync local user state
      const session = await authClient.getSession();
      setUser(session.data?.user || null);
      return session.data;
    } finally {
      setLoading(false);
    }
  };

  // Real Google OAuth — uses custom server endpoint to avoid cross-domain state_mismatch
  const signInWithGoogle = async (from = "/") => {
    const apiURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${apiURL}/api/auth/google/start?from=${encodeURIComponent(from)}`;
  };

  // Called after Google OAuth redirect completes — token comes in URL param
  const finalizeGoogleLogin = async (token) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No authentication token received");
      }

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Decode JWT payload to get user info (no need for extra API call)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const sessionUser = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        image: payload.image,
      };

      setUser(sessionUser);
      return sessionUser;
    } catch (err) {
      console.error("Failed to finalize Google login:", err);
      localStorage.removeItem("token");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUpEmail,
        signInEmail,
        signInWithGoogle,
        finalizeGoogleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
