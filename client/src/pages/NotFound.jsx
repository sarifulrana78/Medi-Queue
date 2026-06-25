import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fadeInUp">
      <div className="bg-base-200 p-8 md:p-12 rounded-3xl border border-base-300 max-w-md w-full shadow-2xl flex flex-col items-center gap-6">
        
        {/* Error icon */}
        <div className="bg-error/10 text-error p-4 rounded-full border border-error/20 animate-bounce">
          <Compass className="h-12 w-12" />
        </div>

        {/* Error Details */}
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-black text-primary">404</h1>
          <h2 className="text-xl font-extrabold tracking-tight">Page Not Found</h2>
          <p className="text-xs text-base-content/60 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Button */}
        <Link
          to="/"
          className="btn btn-primary rounded-xl font-bold flex items-center justify-center gap-2 w-full mt-2"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

      </div>
    </div>
  );
};

export default NotFound;
