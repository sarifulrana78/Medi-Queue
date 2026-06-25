import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, LogOut, User, Menu, X, GraduationCap, Mail, Phone, Globe } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import Swal from "sweetalert2";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dark/Light Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Apply DaisyUI and Tailwind Dark Mode class
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Nav link active class helper
  const linkClass = ({ isActive }) =>
    `font-semibold text-sm transition-colors hover:text-primary ${
      isActive ? "text-primary border-b-2 border-primary pb-1" : "text-base-content/75 pb-1"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block py-2 font-semibold text-sm transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-base-content/75"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content font-sans">
      {/* ----------------- NAVBAR ----------------- */}
      <header className="sticky top-0 z-50 glass-nav shadow-sm bg-base-100/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-primary font-extrabold text-2xl tracking-tight">
              <GraduationCap className="h-7 w-7 text-primary" />
              <span>Medi<span className="text-secondary">Queue</span></span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/tutors" className={linkClass}>Tutors</NavLink>
            {user && (
              <>
                <NavLink to="/add-tutor" className={linkClass}>Add Tutor</NavLink>
                <NavLink to="/my-tutors" className={linkClass}>My Tutors</NavLink>
                <NavLink to="/my-booked-sessions" className={linkClass}>My Bookings</NavLink>
              </>
            )}
          </nav>

          {/* Right Section: Theme & Profile/Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle text-base-content"
              aria-label="Toggle Theme"
              id="theme-toggler"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-primary/20">
                  <div className="w-10 rounded-full">
                    <img
                      src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                      alt={user.name}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-52 border border-base-300 gap-1 mt-2"
                >
                  <li className="px-4 py-2 border-b border-base-300">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                  </li>
                  <li>
                    <Link to="/my-tutors" className="text-sm py-2">
                      <User className="h-4 w-4 mr-2" /> My Profile / Tutors
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-sm text-error hover:bg-error/10 py-2">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm font-semibold">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm rounded-lg font-semibold shadow-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle btn-sm text-base-content" id="mobile-theme-toggler">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
                <Menu className="h-5 w-5" />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-4 shadow-lg bg-base-200 rounded-box w-64 border border-base-300 gap-2 mt-2">
                <NavLink to="/" className={mobileLinkClass}>Home</NavLink>
                <NavLink to="/tutors" className={mobileLinkClass}>Tutors</NavLink>
                {user ? (
                  <>
                    <NavLink to="/add-tutor" className={mobileLinkClass}>Add Tutor</NavLink>
                    <NavLink to="/my-tutors" className={mobileLinkClass}>My Tutors</NavLink>
                    <NavLink to="/my-booked-sessions" className={mobileLinkClass}>My Bookings</NavLink>
                    <div className="divider my-1"></div>
                    <div className="px-2 py-1">
                      <p className="font-bold text-xs truncate">{user.name}</p>
                      <p className="text-[10px] text-base-content/60 truncate">{user.email}</p>
                    </div>
                    <li>
                      <button onClick={handleLogout} className="btn btn-error btn-outline btn-sm w-full mt-2 font-semibold">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <div className="divider my-1"></div>
                    <Link to="/login" className="btn btn-ghost btn-sm w-full text-center">Login</Link>
                    <Link to="/register" className="btn btn-primary btn-sm w-full text-center mt-1">Register</Link>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* ----------------- DYNAMIC OUTLET ----------------- */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full transition-colors duration-300">
        <Outlet />
      </main>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-base-200 border-t border-base-300 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 text-primary font-black text-xl">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>MediQueue</span>
            </Link>
            <p className="text-sm text-base-content/70 leading-relaxed">
              MediQueue simplifies educational and medical session bookings, preventing conflicts and fostering direct student-tutor learning bridges.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/90 mb-2">Learning Services</h3>
            <Link to="/tutors" className="text-sm text-base-content/70 hover:text-primary transition-colors">Browse Tutors</Link>
            <Link to="/tutors?search=Biology" className="text-sm text-base-content/70 hover:text-primary transition-colors">Biology Classes</Link>
            <Link to="/tutors?search=Chemistry" className="text-sm text-base-content/70 hover:text-primary transition-colors">Chemistry Classes</Link>
            <Link to="/tutors?search=Physics" className="text-sm text-base-content/70 hover:text-primary transition-colors">Physics Seminars</Link>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/90 mb-2">Contact Us</h3>
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Mail className="h-4 w-4 text-primary" />
              <span>support@mediqueue.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Phone className="h-4 w-4 text-primary" />
              <span>+1 (555) 234-5678</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Globe className="h-4 w-4 text-primary" />
              <span>www.mediqueue.com</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/90 mb-2">Follow Us</h3>
            <p className="text-xs text-base-content/60 mb-2">Get updates on new available tutors and special courses.</p>
            <div className="flex items-center gap-3">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm bg-base-300/40 text-base-content hover:bg-primary hover:text-white transition-colors" aria-label="X (formerly Twitter)">
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm bg-base-300/40 text-base-content hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm bg-base-300/40 text-base-content hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm bg-base-300/40 text-base-content hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedinIn className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-base-300 bg-base-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-base-content/60 gap-4">
            <p>&copy; {new Date().getFullYear()} MediQueue. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Layout;
