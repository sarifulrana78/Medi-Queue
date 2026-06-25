import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { Calendar, GraduationCap, MapPin, DollarSign, Clock, User, Phone, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

const TutorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Modal States
  const [showModal, setShowModal] = useState(false);
  const [studentPhone, setStudentPhone] = useState("");
  const [bookingSubmit, setBookingSubmit] = useState(false);

  const fetchTutorDetails = async () => {
    try {
      const response = await api.get(`/api/tutors/${id}`);
      setTutor(response.data);
    } catch (error) {
      console.error("Error fetching tutor details:", error);
      Swal.fire({
        title: "Tutor Not Found",
        text: "The requested tutor profile does not exist.",
        icon: "error",
        confirmButtonText: "Return to Tutors",
      }).then(() => navigate("/tutors"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorDetails();
  }, [id]);

  // Validation Checks
  const isFullyBooked = tutor?.totalSlot <= 0;

  const getBookingRestriction = () => {
    if (!tutor) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const sessionDate = new Date(tutor.sessionStartDate);
    sessionDate.setHours(0, 0, 0, 0);

    if (now < sessionDate) {
      return "Booking is not available yet for this tutor";
    }
    return null;
  };

  const bookingRestrictionMsg = getBookingRestriction();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!studentPhone) {
      Swal.fire({
        title: "Phone Required",
        text: "Please enter your phone number to complete the booking.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setBookingSubmit(true);
    try {
      await api.post("/api/bookings", {
        tutorId: tutor._id,
        studentPhone: studentPhone,
      });

      // Update state local slot count decrement
      setTutor((prev) => ({ ...prev, totalSlot: Math.max(0, prev.totalSlot - 1) }));

      Swal.fire({
        title: "Session Booked!",
        text: `Successfully booked a learning session with ${tutor.name}.`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      setShowModal(false);
      setStudentPhone("");
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to book session.";
      Swal.fire({
        title: "Booking Refused",
        text: errMsg,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setBookingSubmit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!tutor) return null;

  return (
    <div className="max-w-5xl mx-auto my-6 animate-fadeInUp flex flex-col gap-8">
      {/* ----------------- PROFILE DETAILED VIEW ----------------- */}
      <div className="bg-base-200 rounded-3xl p-6 md:p-8 border border-base-300 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Tutor Photo */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden aspect-square shadow-md border border-base-300 bg-base-300">
            <img src={tutor.photo} alt={tutor.name} className="w-full h-full object-cover" />
          </div>
          <div className="bg-primary/10 text-primary text-center font-bold py-2 rounded-xl border border-primary/20 text-sm">
            {tutor.subject} Category
          </div>
        </div>

        {/* Tutor Summary Details */}
        <div className="md:col-span-2 flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">{tutor.name}</h1>
              <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full border border-accent/20">
                {tutor.teachingMode} Mode
              </span>
            </div>
            
            <p className="text-sm font-semibold text-primary italic flex items-center gap-1.5">
              <GraduationCap className="h-5 w-5 text-primary" />
              {tutor.institution}
            </p>

            <div className="divider my-1"></div>

            {/* Quick specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="flex items-center gap-2 text-sm text-base-content/80">
                <Clock className="h-4 w-4 text-secondary" />
                <span><strong>Days:</strong> {tutor.availableDays}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/80">
                <Clock className="h-4 w-4 text-secondary" />
                <span><strong>Hours:</strong> {tutor.availableTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/80">
                <Calendar className="h-4 w-4 text-secondary" />
                <span><strong>Starts:</strong> {tutor.sessionStartDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/80">
                <MapPin className="h-4 w-4 text-secondary" />
                <span><strong>Location:</strong> {tutor.location}</span>
              </div>
            </div>
          </div>

          {/* Pricing & Availability Grid */}
          <div className="grid grid-cols-2 gap-4 bg-base-100 p-4 rounded-2xl border border-base-300/80 my-2">
            <div>
              <p className="text-[10px] text-base-content/50 uppercase font-bold tracking-wider">Hourly Rate</p>
              <p className="text-2xl font-black text-primary flex items-center">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>{tutor.hourlyFee}</span>
                <span className="text-xs text-base-content/50 font-normal ml-1">/ hour</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-base-content/50 uppercase font-bold tracking-wider">Available Slots</p>
              <p className={`text-2xl font-black ${isFullyBooked ? "text-error" : "text-success"}`}>
                {tutor.totalSlot}
                <span className="text-xs text-base-content/50 font-normal ml-1">left</span>
              </p>
            </div>
          </div>

          {/* Safeguard & Action Button */}
          <div className="flex flex-col gap-3">
            {/* Booking constraints warnings */}
            {isFullyBooked ? (
              <div className="alert alert-error rounded-xl py-2 px-3 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>This session is fully booked. You can’t join at the moment.</span>
              </div>
            ) : bookingRestrictionMsg ? (
              <div className="alert alert-warning rounded-xl py-2 px-3 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{bookingRestrictionMsg}</span>
              </div>
            ) : null}

            {/* Book Button */}
            <button
              onClick={() => setShowModal(true)}
              disabled={isFullyBooked || !!bookingRestrictionMsg}
              className="btn btn-primary btn-block rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {isFullyBooked ? (
                <span>No Available Slots Left</span>
              ) : bookingRestrictionMsg ? (
                <span>Booking Not Available Yet</span>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Book Session</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ----------------- EXPERIENCE DETAILS SECTION ----------------- */}
      <div className="bg-base-200 rounded-3xl p-6 border border-base-300 shadow-md">
        <h2 className="text-xl font-extrabold mb-3 text-base-content/95 border-b border-base-300 pb-2">
          Qualifications & Experience Summary
        </h2>
        <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
          {tutor.experience}
        </p>
        <div className="mt-4 pt-4 border-t border-base-300 text-xs text-base-content/50 flex flex-wrap gap-x-6 gap-y-2">
          <p><strong>Created by:</strong> {tutor.ownerName}</p>
          <p><strong>Contact email:</strong> {tutor.ownerEmail}</p>
        </div>
      </div>

      {/* ----------------- BOOKING MODAL ----------------- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-200 rounded-2xl shadow-2xl max-w-md w-full border border-base-300 overflow-hidden animate-fadeInUp">
            
            {/* Modal Header */}
            <div className="bg-primary p-6 text-white text-center">
              <h2 className="font-extrabold text-xl">Reserve Learning Session</h2>
              <p className="text-xs text-white/80 mt-1">Submit your phone to finalize booking token</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleBookingSubmit} className="p-6 flex flex-col gap-4">
              
              {/* Tutor Name (Auto filled) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Selected Tutor</span>
                </label>
                <input
                  type="text"
                  value={tutor.name}
                  className="input input-bordered w-full rounded-xl bg-base-300 text-base-content/60 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Student Name (Auto filled) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Student Name</span>
                </label>
                <input
                  type="text"
                  value={user?.name || "Anonymous User"}
                  className="input input-bordered w-full rounded-xl bg-base-300 text-base-content/60 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Student Email (Auto filled) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Student Email</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="input input-bordered w-full rounded-xl bg-base-300 text-base-content/60 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Student Phone (INPUT) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Phone Number</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    placeholder="e.g. +880 1712-345678"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="input input-bordered w-full pl-10 rounded-xl"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-base-300">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmit}
                  className="btn btn-primary rounded-lg font-bold flex items-center gap-1.5"
                >
                  {bookingSubmit ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDetails;
