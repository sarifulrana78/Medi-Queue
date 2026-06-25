import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import { BookOpen, Award, CheckCircle, ArrowRight, Star, Clock, MapPin } from "lucide-react";

const Home = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      title: "Master Clinical & Academic Subjects",
      description: "Connect with certified medical practitioners, doctors, and academic experts for personalized 1-on-1 tutoring sessions.",
      tag: "EXPERT INSTRUCTORS"
    },
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
      title: "Interactive Online & Offline Classes",
      description: "Book custom learning sessions that fit your busy schedule. Pick from online virtual rooms or face-to-face physical meetings.",
      tag: "FLEXIBLE SCHEDULING"
    },
    {
      image: "https://images.unsplash.com/photo-1576086213369-97a306dca665?auto=format&fit=crop&q=80&w=1200",
      title: "Eliminate Booking Conflicts Instantly",
      description: "MediQueue's digital token system ensures you always get the slot you booked, completely conflict-free.",
      tag: "CONFLICT-FREE BOOKING"
    }
  ];

  // Auto-play slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  // Fetch 6 available tutors
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get("/api/tutors?limit=6");
        setTutors(response.data);
      } catch (error) {
        console.error("Error fetching tutors for home page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  return (
    <div className="flex flex-col gap-16 animate-fadeInUp">
      {/* ----------------- CAROUSEL BANNER ----------------- */}
      <section className="relative rounded-3xl overflow-hidden h-[450px] shadow-xl group border border-base-300">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Dark Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            {/* Slide Text Content */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center max-w-xl px-8 sm:px-16 z-20 text-white gap-4">
              <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold w-fit tracking-wider text-white">
                {slide.tag}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-light">
                {slide.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/tutors"
                  className="btn btn-primary rounded-xl px-6 font-bold flex items-center gap-2 group-hover:scale-105 transition-transform"
                >
                  Browse Tutors
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/tutors?search=Biology"
                  className="btn btn-outline btn-white border-white text-white hover:bg-white hover:text-black rounded-xl px-6 font-semibold"
                >
                  Learn Biology
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-6 right-8 flex gap-2 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === activeSlide ? "bg-primary" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ----------------- AVAILABLE TUTORS SECTION ----------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Available Tutors</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Our Top Educational Mentors</h2>
          </div>
          <Link to="/tutors" className="btn btn-outline btn-primary btn-sm rounded-xl font-bold flex items-center gap-2">
            View All Tutors
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-2xl border border-dashed border-base-300">
            <BookOpen className="h-12 w-12 text-base-content/40 mx-auto mb-3" />
            <h3 className="font-bold text-lg">No Tutors Seeded</h3>
            <p className="text-sm text-base-content/60 mt-1">Populate the database using the seed script or create a profile!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                className="card bg-base-200 hover:shadow-xl transition-all duration-300 border border-base-300 overflow-hidden flex flex-col h-full group"
              >
                {/* Tutor Card Header / Image */}
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

                {/* Tutor Body */}
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

                  {/* Tutor Info Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-base-content/80">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-secondary" />
                      <span className="truncate">{tutor.availableTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <MapPin className="h-3.5 w-3.5 text-secondary" />
                      <span className="truncate">{tutor.location}</span>
                    </div>
                  </div>

                  {/* Slots & Fees */}
                  <div className="flex justify-between items-center bg-base-100 p-3 rounded-xl border border-base-300/60 mt-2">
                    <div>
                      <p className="text-[10px] text-base-content/50 uppercase font-semibold">Hourly Fee</p>
                      <p className="text-sm font-bold text-primary">${tutor.hourlyFee}/hr</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-base-content/50 uppercase font-semibold">Slots Available</p>
                      <p className={`text-sm font-bold ${tutor.totalSlot === 0 ? "text-error" : "text-success"}`}>
                        {tutor.totalSlot} slots
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions mt-auto pt-4">
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
      </section>

      {/* ----------------- EXTRA SECTION 1: STATISTICS ----------------- */}
      <section className="bg-neutral text-neutral-content rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden border border-neutral-content/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md flex flex-col gap-2">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Platform Metrics</span>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Improving Learning Access Everywhere</h2>
            <p className="text-sm text-neutral-content/80 mt-1">
              MediQueue streamlines the connection between expert mentors and students, guaranteeing reliable scheduling and professional instruction.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-neutral-focus p-6 rounded-2xl border border-neutral-content/5 flex flex-col text-center">
              <span className="text-3xl font-black text-primary">500+</span>
              <span className="text-xs text-neutral-content/60 uppercase mt-1 tracking-wider font-semibold">Active Tutors</span>
            </div>
            <div className="bg-neutral-focus p-6 rounded-2xl border border-neutral-content/5 flex flex-col text-center">
              <span className="text-3xl font-black text-secondary">10k+</span>
              <span className="text-xs text-neutral-content/60 uppercase mt-1 tracking-wider font-semibold">Bookings Made</span>
            </div>
            <div className="bg-neutral-focus p-6 rounded-2xl border border-neutral-content/5 flex flex-col text-center">
              <span className="text-3xl font-black text-accent">99%</span>
              <span className="text-xs text-neutral-content/60 uppercase mt-1 tracking-wider font-semibold">Satisfaction</span>
            </div>
            <div className="bg-neutral-focus p-6 rounded-2xl border border-neutral-content/5 flex flex-col text-center">
              <span className="text-3xl font-black text-info">12+</span>
              <span className="text-xs text-neutral-content/60 uppercase mt-1 tracking-wider font-semibold">Core Subjects</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- EXTRA SECTION 2: HOW IT WORKS ----------------- */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Process Flow</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">How MediQueue Works</h2>
          <p className="text-sm text-base-content/70">
            Booking an educational or medical tutoring session is quick, safe, and completely conflict-free. Follow these simple steps:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {/* Step 1 */}
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
            <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all">
              1
            </div>
            <h3 className="font-extrabold text-base mt-2">Browse & Filter</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Explore professional tutors and filter by subject categories or custom dates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
            <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all">
              2
            </div>
            <h3 className="font-extrabold text-base mt-2">Check Restrictions</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Ensure that slots are available and the session's booking date has commenced.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
            <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all">
              3
            </div>
            <h3 className="font-extrabold text-base mt-2">Instant Booking</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Confirm your booking to decrease availability automatically and issue your digital ticket.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
            <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all">
              4
            </div>
            <h3 className="font-extrabold text-base mt-2">Start Learning</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Access your booked session online or coordinate offline instruction securely.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
