import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import Swal from "sweetalert2";

const Login = () => {
  const { signInEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      await signInEmail(email, password);
      Swal.fire({
        title: "Welcome Back!",
        text: "Logged in successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      // Redirect to desired route or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgetPassword = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Forget Password Info",
      text: "💡 Password recovery is disabled for examiner convenience.",
      icon: "info",
      confirmButtonText: "Got it",
      buttonsStyling: true,
      customClass: {
        confirmButton: "btn btn-primary"
      }
    });
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-base-200 p-8 rounded-2xl shadow-xl border border-base-300 animate-fadeInUp">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black tracking-tight text-primary">Login Profile</h2>
        <p className="text-xs text-base-content/60 mt-1.5">Sign in to book custom tutoring sessions</p>
      </div>

      {errorMsg && (
        <div className="alert alert-error rounded-xl mb-4 text-xs font-semibold py-2.5">
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Email Address</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Password</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
          <div className="flex justify-end mt-1.5">
            <button
              onClick={handleForgetPassword}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Forget Password?
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary rounded-xl font-bold flex items-center justify-center gap-2 mt-2 w-full"
        >
          {submitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </>
          )}
        </button>
      </form>

      {/* Social Login Divider */}
      <div className="divider my-6 text-[10px] uppercase font-bold text-base-content/40 tracking-wider">Or login with</div>

      {/* Google Social Button */}
      <button
        onClick={async () => {
          try {
            await signInWithGoogle(location.state?.from?.pathname || "/");
          } catch (err) {
            console.error("Google sign-in error:", err);
            Swal.fire({
              title: "Google Sign-In Failed",
              text: err.message || "Could not connect to Google. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }}
        className="btn btn-outline btn-primary rounded-xl font-bold flex items-center justify-center gap-2.5 w-full"
      >
        <FaGoogle className="h-4 w-4 text-red-500" />
        <span>Continue with Google</span>
      </button>

      {/* Toggle Links */}
      <div className="text-center mt-6 text-sm text-base-content/70">
        New to MediQueue?{" "}
        <Link to="/register" className="text-primary font-bold hover:underline">
          Register Here
        </Link>
      </div>
    </div>
  );
};

export default Login;
