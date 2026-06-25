import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { XCircle, Calendar, CalendarCheck, User, Phone, CheckCircle, Clock } from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/api/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching my bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = (bookingId, tutorName) => {
    Swal.fire({
      title: "Cancel Booking?",
      text: `Are you sure you want to cancel your session with ${tutorName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, cancel booking",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/api/bookings/${bookingId}/cancel`);

          // Update status in local state immediately without reload
          setBookings((prev) =>
            prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
          );

          Swal.fire({
            title: "Booking Cancelled",
            text: "Your session booking has been cancelled successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Cancellation Failed",
            text: error.response?.data?.message || "An error occurred while cancelling your session.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fadeInUp">
      {/* Header */}
      <div className="text-center md:text-left flex flex-col gap-1">
        <span className="text-primary font-bold text-xs uppercase tracking-widest">Student Portal</span>
        <h2 className="text-3xl font-extrabold tracking-tight">My Booked Sessions</h2>
        <p className="text-sm text-base-content/60 max-w-xl">
          Track, review, or cancel your scheduled learning slots with verified instructors.
        </p>
      </div>

      {/* ----------------- BOOKINGS TABLE ----------------- */}
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-3xl border border-dashed border-base-300">
          <Calendar className="h-14 w-14 text-base-content/40 mx-auto mb-3" />
          <h3 className="font-extrabold text-xl">No Bookings Found</h3>
          <p className="text-sm text-base-content/60 mt-1 max-w-sm mx-auto">
            You haven't reserved any educational sessions yet. Explore our tutors grid to schedule your first class!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-2xl border border-base-300 shadow-md">
          <table className="table table-zebra w-full text-sm">
            {/* head */}
            <thead>
              <tr className="bg-base-300 text-base-content font-bold uppercase text-xs">
                <th>Tutor Name</th>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Student Phone</th>
                <th>Reserved On</th>
                <th>Booking Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover">
                  <td className="font-bold text-base-content/95">{booking.tutorName}</td>
                  <td>
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-base-content/40" />
                      <span>{booking.studentName}</span>
                    </div>
                  </td>
                  <td className="text-base-content/75">{booking.studentEmail}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-base-content/40" />
                      <span>{booking.studentPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-base-content/60">
                      <Clock className="h-3.5 w-3.5 text-base-content/40" />
                      <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    {booking.status === "booked" ? (
                      <span className="badge badge-success font-semibold text-xs px-2.5 py-1 text-white flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Booked
                      </span>
                    ) : (
                      <span className="badge badge-neutral font-semibold text-xs px-2.5 py-1 text-base-content flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleCancelBooking(booking._id, booking.tutorName)}
                        disabled={booking.status === "cancelled"}
                        className={`btn btn-xs rounded-lg font-semibold flex items-center gap-1 ${
                          booking.status === "cancelled"
                            ? "btn-disabled bg-base-300 text-base-content/40"
                            : "btn-outline btn-error"
                        }`}
                        title={booking.status === "cancelled" ? "Booking cancelled" : "Cancel Session"}
                      >
                        <XCircle className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
