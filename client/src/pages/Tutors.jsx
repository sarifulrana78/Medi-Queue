import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import { Search, Calendar, RefreshCw, Star, Clock, MapPin, ArrowRight, Frown } from "lucide-react";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get("/api/tutors", { params });
      setTutors(response.data);
    } catch (error) {
      console.error("Error fetching tutors list:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on query change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTutors();
    }, 400); // Debounce search requests to avoid spamming the database

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeInUp">
      {/* Page Header */}
      <div className="text-center md:text-left flex flex-col gap-1">
        <span className="text-primary font-bold text-xs uppercase tracking-widest">Global Network</span>
        <h2 className="text-3xl font-extrabold tracking-tight">Browse All Educational Mentors</h2>
        <p className="text-sm text-base-content/60 max-w-xl">
          Search by name, subject, or filter by session starting dates to find your ideal professional tutor.
        </p>
      </div>

      {/* ----------------- SEARCH & FILTERS BAR ----------------- */}
      <div className="bg-base-200 p-6 rounded-2xl border border-base-300 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Search Input */}
        <div className="form-control w-full md:col-span-2">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/70 uppercase">Search by Tutor Name</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="e.g. Jenkins, Chen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl input-sm md:input-md"
            />
          </div>
        </div>

        {/* Date Filter Starts */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/70 uppercase">Session Starts From</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Calendar className="h-4 w-4" />
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl input-sm md:input-md"
            />
          </div>
        </div>

        {/* Date Filter Ends */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/70 uppercase">Session Starts Before</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Calendar className="h-4 w-4" />
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl input-sm md:input-md"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-4 flex justify-end">
          {(searchTerm || startDate || endDate) && (
            <button
              onClick={handleClearFilters}
              className="btn btn-ghost btn-sm text-error font-semibold flex items-center gap-1.5 rounded-lg"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ----------------- TUTORS LIST GRID ----------------- */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs text-base-content/50 animate-pulse font-medium">Filtering database...</p>
          </div>
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-3xl border border-dashed border-base-300">
          <Frown className="h-14 w-14 text-base-content/40 mx-auto mb-3" />
          <h3 className="font-extrabold text-xl">No Tutors Match Your Query</h3>
          <p className="text-sm text-base-content/60 mt-1 max-w-sm mx-auto">
            Try checking spelling, resetting date filters, or look up different subjects!
          </p>
          <button
            onClick={handleClearFilters}
            className="btn btn-primary btn-sm rounded-xl font-bold mt-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor._id}
              className="card bg-base-200 hover:shadow-xl transition-all duration-300 border border-base-300 overflow-hidden flex flex-col h-full group"
            >
              {/* Photo */}
              <div className="relative h-48 overflow-hidden bg-base-300">
                <img
                  src={tutor.photo}
                  alt={tutor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
                  {tutor.subject}
                </div>
              </div>

              {/* Body */}
              <div className="card-body p-6 flex flex-col flex-grow gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="card-title text-lg font-bold group-hover:text-primary transition-colors">
                    {tutor.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                    <Star className="h-4 w-4 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>

                <p className="text-xs text-base-content/70 italic font-medium">
                  {tutor.institution}
                </p>

                <div className="divider my-0"></div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-base-content/85">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-secondary" />
                    <span className="truncate">{tutor.availableTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <MapPin className="h-3.5 w-3.5 text-secondary" />
                    <span className="truncate">{tutor.location}</span>
                  </div>
                </div>

                {/* Mode & Date info */}
                <div className="flex flex-col gap-1 bg-base-100/50 p-2.5 rounded-lg border border-base-300/40 text-[11px] text-base-content/75">
                  <p><strong>Teaching Mode:</strong> {tutor.teachingMode}</p>
                  <p><strong>Session Starts:</strong> {tutor.sessionStartDate}</p>
                </div>

                {/* Slots & Fees */}
                <div className="flex justify-between items-center bg-base-100 p-3 rounded-xl border border-base-300/60 mt-2">
                  <div>
                    <p className="text-[10px] text-base-content/50 uppercase font-semibold">Hourly Fee</p>
                    <p className="text-sm font-bold text-primary">${tutor.hourlyFee}/hr</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-base-content/50 uppercase font-semibold">Slots Left</p>
                    <p className={`text-sm font-bold ${tutor.totalSlot === 0 ? "text-error" : "text-success"}`}>
                      {tutor.totalSlot} slots
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions mt-auto pt-4 border-t border-base-300/40">
                  <Link
                    to={`/tutors/${tutor._id}`}
                    className="btn btn-primary btn-sm rounded-lg w-full font-bold flex items-center justify-center gap-2"
                  >
                    Book Session
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutors;
