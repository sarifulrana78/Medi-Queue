import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Image, Lock, UserPlus } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import Swal from "sweetalert2";

const Register = () => {
  const { signUpEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Live password validation helper
  const handlePasswordChange = (val) => {
    setPassword(val);
    if (!val) {
      setPasswordError("");
      return;
    }
    if (val.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(val)) {
      setPasswordError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(val)) {
      setPasswordError("Password must contain at least one lowercase letter.");
      return;
    }
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate password before submission
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMsg("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setErrorMsg("Password must contain at least one lowercase letter.");
      return;
    }

    setSubmitting(true);

    try {
      await signUpEmail(name, email, password, photoUrl);

      Swal.fire({
        title: "Registration Successful!",
        text: "Please sign in with your credentials.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to register. Email may already be in use.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-base-200 p-8 rounded-2xl shadow-xl border border-base-300 animate-fadeInUp">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black tracking-tight text-primary">Create Account</h2>
        <p className="text-xs text-base-content/60 mt-1.5 font-medium">Join MediQueue to reserve custom tutoring hours</p>
      </div>

      {errorMsg && (
        <div className="alert alert-error rounded-xl mb-4 text-xs font-semibold py-2.5">
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Display Name</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

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
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Photo URL Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Photo URL</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Image className="h-4 w-4" />
            </span>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl"
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
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
          {passwordError && (
            <p className="text-error text-xs font-semibold mt-1.5 leading-relaxed">{passwordError}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !!passwordError}
          className="btn btn-primary rounded-xl font-bold flex items-center justify-center gap-2 mt-2 w-full"
        >
          {submitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </>
          )}
        </button>
      </form>

      {/* Social Login Divider */}
      <div className="divider my-6 text-[10px] uppercase font-bold text-base-content/40 tracking-wider">Or register with</div>

      {/* Google Social Button */}
      <button
        onClick={() => signInWithGoogle("/")}
        className="btn btn-outline btn-primary rounded-xl font-bold flex items-center justify-center gap-2.5 w-full"
      >
        <FaGoogle className="h-4 w-4 text-red-500" />
        <span>Continue with Google</span>
      </button>

      {/* Toggle Links */}
      <div className="text-center mt-6 text-sm text-base-content/70">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Login Here
        </Link>
      </div>
    </div>
  );
};

export default Register;
