import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const AuthCallback = () => {
  const { finalizeGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const finalize = async () => {
      try {
        const sessionUser = await finalizeGoogleLogin();

        Swal.fire({
          title: "Welcome!",
          text: `Signed in as ${sessionUser?.name || "User"}`,
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });

        // Redirect to the page the user was trying to visit, or home
        const params = new URLSearchParams(location.search);
        const next = params.get("next") || "/";
        navigate(next, { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        Swal.fire({
          title: "Login Failed",
          text: err.message || "Google sign-in could not be completed.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
        navigate("/login", { replace: true });
      }
    };

    finalize();
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-base-content/70 font-medium">Completing sign-in, please wait…</p>
    </div>
  );
};

export default AuthCallback;
