import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { Edit, Trash2, BookOpen, UserCheck, Calendar, MapPin, DollarSign, Image } from "lucide-react";

const MyTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update Modal States
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    subject: "Mathematics",
    availableDays: "",
    availableTime: "",
    hourlyFee: "",
    totalSlot: "",
    sessionStartDate: "",
    institution: "",
    experience: "",
    location: "",
    teachingMode: "Online",
  });
  const [updating, setUpdating] = useState(false);

  const fetchMyTutors = async () => {
    try {
      const response = await api.get("/api/my-tutors");
      setTutors(response.data);
    } catch (error) {
      console.error("Error fetching my tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTutors();
  }, []);

  // Delete Action with SweetAlert Confirmation
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete the tutor profile for ${name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete profile",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/tutors/${id}`);
          
          // Remove from local state immediately
          setTutors((prev) => prev.filter((t) => t._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "Tutor profile has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Delete Failed",
            text: error.response?.data?.message || "Could not delete tutor profile.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  // Open Update Modal and fill values
  const openUpdateModal = (tutor) => {
    setSelectedTutor(tutor);
    setFormData({
      name: tutor.name,
      photo: tutor.photo,
      subject: tutor.subject,
      availableDays: tutor.availableDays,
      availableTime: tutor.availableTime,
      hourlyFee: tutor.hourlyFee,
      totalSlot: tutor.totalSlot,
      sessionStartDate: tutor.sessionStartDate,
      institution: tutor.institution,
      experience: tutor.experience,
      location: tutor.location,
      teachingMode: tutor.teachingMode,
    });
    setShowUpdateModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update Form Submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await api.put(`/api/tutors/${selectedTutor._id}`, formData);
      const updatedTutor = response.data.tutor;

      // Update state in-place immediately
      setTutors((prev) =>
        prev.map((t) => (t._id === selectedTutor._id ? updatedTutor : t))
      );

      Swal.fire({
        title: "Tutor Updated!",
        text: `${formData.name}'s profile was updated successfully.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      setShowUpdateModal(false);
      setSelectedTutor(null);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Update Failed",
        text: error.response?.data?.message || "Could not save tutor changes.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUpdating(false);
    }
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
        <span className="text-primary font-bold text-xs uppercase tracking-widest">Instructor Dashboard</span>
        <h2 className="text-3xl font-extrabold tracking-tight">Manage My Tutors</h2>
        <p className="text-sm text-base-content/60 max-w-xl">
          View, edit, or remove the tutor profiles you have created on the MediQueue platform.
        </p>
      </div>

      {/* ----------------- TABLE LIST ----------------- */}
      {tutors.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-3xl border border-dashed border-base-300">
          <BookOpen className="h-14 w-14 text-base-content/40 mx-auto mb-3" />
          <h3 className="font-extrabold text-xl">No Tutor Profiles Listed</h3>
          <p className="text-sm text-base-content/60 mt-1 max-w-sm mx-auto">
            You haven't added any tutor profiles yet. Head over to "Add Tutor" to list your first educational session!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-2xl border border-base-300 shadow-md">
          <table className="table table-zebra w-full text-sm">
            {/* head */}
            <thead>
              <tr className="bg-base-300 text-base-content font-bold uppercase text-xs">
                <th>Avatar</th>
                <th>Tutor Name</th>
                <th>Subject</th>
                <th>Teaching Mode</th>
                <th>Session Date</th>
                <th>Hourly Fee</th>
                <th>Slots Left</th>
                <th>Location</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((tutor) => (
                <tr key={tutor._id} className="hover">
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12 bg-base-300">
                        <img src={tutor.photo} alt={tutor.name} className="object-cover" />
                      </div>
                    </div>
                  </td>
                  <td className="font-bold text-base-content/95">{tutor.name}</td>
                  <td>
                    <span className="badge badge-primary font-semibold text-xs px-2.5 py-1 text-white">
                      {tutor.subject}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-accent badge-outline font-semibold text-xs px-2.5 py-1">
                      {tutor.teachingMode}
                    </span>
                  </td>
                  <td className="font-medium text-base-content/75">{tutor.sessionStartDate}</td>
                  <td className="font-bold text-primary">${tutor.hourlyFee}/hr</td>
                  <td className={`font-bold ${tutor.totalSlot === 0 ? "text-error" : "text-success"}`}>
                    {tutor.totalSlot} slots
                  </td>
                  <td className="text-base-content/70">{tutor.location}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openUpdateModal(tutor)}
                        className="btn btn-outline btn-info btn-xs rounded-lg flex items-center gap-1 font-semibold"
                        title="Edit Tutor Profile"
                      >
                        <Edit className="h-3 w-3" />
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(tutor._id, tutor.name)}
                        className="btn btn-outline btn-error btn-xs rounded-lg flex items-center gap-1 font-semibold"
                        title="Delete Tutor Profile"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ----------------- UPDATE MODAL ----------------- */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-base-200 rounded-2xl shadow-2xl max-w-2xl w-full border border-base-300 overflow-hidden my-8 animate-fadeInUp">
            
            {/* Header */}
            <div className="bg-primary p-6 text-white text-center">
              <h2 className="font-extrabold text-xl">Update Tutor Profile</h2>
              <p className="text-xs text-white/80 mt-1">Modify details for {selectedTutor?.name}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              
              {/* Tutor Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Tutor Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Photo URL */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Photo URL</span>
                </label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Subject Category */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Subject Category</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className="select select-bordered w-full rounded-xl"
                  required
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              {/* Teaching Mode */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Teaching Mode</span>
                </label>
                <select
                  name="teachingMode"
                  value={formData.teachingMode}
                  onChange={handleFormChange}
                  className="select select-bordered w-full rounded-xl"
                  required
                >
                  <option value="Online">Online Only</option>
                  <option value="Offline">Offline Only</option>
                  <option value="Both">Both (Hybrid)</option>
                </select>
              </div>

              {/* Available Days */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Available Days</span>
                </label>
                <input
                  type="text"
                  name="availableDays"
                  value={formData.availableDays}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Available Time Slot */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Available Time</span>
                </label>
                <input
                  type="text"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Hourly Fee */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Hourly Fee ($)</span>
                </label>
                <input
                  type="number"
                  name="hourlyFee"
                  value={formData.hourlyFee}
                  onChange={handleFormChange}
                  min="0"
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Total Slots */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Total Slots</span>
                </label>
                <input
                  type="number"
                  name="totalSlot"
                  value={formData.totalSlot}
                  onChange={handleFormChange}
                  min="0"
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Session Start Date */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Session Start Date</span>
                </label>
                <input
                  type="date"
                  name="sessionStartDate"
                  value={formData.sessionStartDate}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Location */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Location (City)</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Institution */}
              <div className="form-control w-full sm:col-span-2">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Educational Institution</span>
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Experience summary */}
              <div className="form-control w-full sm:col-span-2">
                <label className="label">
                  <span className="label-text font-bold text-xs uppercase text-base-content/70">Experience summary</span>
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleFormChange}
                  className="textarea textarea-bordered w-full rounded-xl h-20"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="sm:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-base-300">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="btn btn-ghost rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary rounded-lg font-bold flex items-center gap-1.5"
                >
                  {updating ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Save Changes"
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

export default MyTutors;
