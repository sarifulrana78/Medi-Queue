import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import Swal from "sweetalert2";
import { PlusCircle, Calendar, GraduationCap, MapPin, DollarSign, Image, Clipboard, Briefcase } from "lucide-react";

const AddTutor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    subject: "Mathematics",
    availableDays: "Sun - Thu",
    availableTime: "5:00 PM - 8:00 PM",
    hourlyFee: "",
    totalSlot: "",
    sessionStartDate: "",
    institution: "",
    experience: "",
    location: "",
    teachingMode: "Online",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/api/tutors", formData);

      Swal.fire({
        title: "Tutor Created Successfully!",
        text: `${formData.name} is now listed as a tutor.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      // Redirect to user's tutors dashboard
      navigate("/my-tutors");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Submission Failed",
        text: error.response?.data?.message || "An error occurred while creating the tutor profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 bg-base-200 p-8 rounded-2xl shadow-xl border border-base-300 animate-fadeInUp">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-tight text-primary flex items-center justify-center gap-2">
          <PlusCircle className="h-8 w-8 text-primary" />
          <span>Add Tutor Profile</span>
        </h2>
        <p className="text-xs text-base-content/60 mt-1.5 font-medium">Create a new tutor profile to offer sessions to students</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tutor Name */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Tutor Full Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Alex Carter"
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>

        {/* Photo URL */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Photo URL (imgbb/postimage link)</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Image className="h-4 w-4" />
            </span>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="e.g. https://imgbb.com/your-image-link"
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Subject Category Dropdown */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Subject / Category</span>
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
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

        {/* Teaching Mode Dropdown */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Teaching Mode</span>
          </label>
          <select
            name="teachingMode"
            value={formData.teachingMode}
            onChange={handleChange}
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
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Available Days</span>
          </label>
          <input
            type="text"
            name="availableDays"
            value={formData.availableDays}
            onChange={handleChange}
            placeholder="e.g. Sun - Thu, Mon/Wed/Fri"
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>

        {/* Available Time Slot */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Available Time Slot</span>
          </label>
          <input
            type="text"
            name="availableTime"
            value={formData.availableTime}
            onChange={handleChange}
            placeholder="e.g. 5:00 PM - 8:00 PM"
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>

        {/* Hourly Fee */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Hourly Fee ($)</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <DollarSign className="h-4 w-4" />
            </span>
            <input
              type="number"
              name="hourlyFee"
              value={formData.hourlyFee}
              onChange={handleChange}
              placeholder="e.g. 45"
              min="0"
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Total Available Slots */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Total Available Slots</span>
          </label>
          <input
            type="number"
            name="totalSlot"
            value={formData.totalSlot}
            onChange={handleChange}
            placeholder="e.g. 5"
            min="0"
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>

        {/* Session Start Date (Date picker) */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Session Start Date</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Calendar className="h-4 w-4" />
            </span>
            <input
              type="date"
              name="sessionStartDate"
              value={formData.sessionStartDate}
              onChange={handleChange}
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Location (Area/City) */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Location (Area/City)</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <MapPin className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Dhaka, Bangladesh"
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Institution */}
        <div className="form-control w-full md:col-span-2">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Educational Institution</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <GraduationCap className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="e.g. Harvard University, Dhaka Medical College"
              className="input input-bordered w-full pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Experience */}
        <div className="form-control w-full md:col-span-2">
          <label className="label">
            <span className="label-text font-bold text-xs uppercase text-base-content/85">Teaching / Medical Experience Summary</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 top-3 left-3 text-base-content/40">
              <Briefcase className="h-4 w-4" />
            </span>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 5+ years instructing medical pharmacology, tutoring chemistry..."
              className="textarea textarea-bordered w-full pl-10 rounded-xl h-24"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-control md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary rounded-xl font-bold flex items-center justify-center gap-2 w-full"
          >
            {submitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Submit Tutor Profile</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddTutor;
