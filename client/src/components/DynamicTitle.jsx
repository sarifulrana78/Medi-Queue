import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles = {
  "/": "Home | MediQueue",
  "/tutors": "Browse Tutors | MediQueue",
  "/add-tutor": "Add Tutor | MediQueue",
  "/my-tutors": "My Tutors | MediQueue",
  "/my-booked-sessions": "My Booked Sessions | MediQueue",
  "/login": "Login | MediQueue",
  "/register": "Register | MediQueue",
  "/auth/callback": "Signing In... | MediQueue",
};

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "MediQueue - Tutor Booking System";

    if (routeTitles[path]) {
      title = routeTitles[path];
    } else if (path.startsWith("/tutors/")) {
      title = "Tutor Details | MediQueue";
    } else if (path !== "") {
      title = "Not Found | MediQueue";
    }

    document.title = title;
  }, [location]);

  return null;
};

export default DynamicTitle;
