import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { ObjectId } from "mongodb";
import { SignJWT } from "jose";
import crypto from "crypto";

import { auth, db } from "./lib/auth.js";
import { verifyJWT } from "./middleware/verifyJWT.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Utility function to generate unique session token
const generateSessionToken = () => {
  return `SESSION_${crypto.randomBytes(16).toString("hex").toUpperCase()}`;
};

// CORS configuration - needs credentials for Better Auth cookies
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "MediQueue Server is running", timestamp: new Date().toISOString() });
});

// ----------------------------------------------------
// Custom Auth Routes (Mounted BEFORE Better Auth Wildcard)
// ----------------------------------------------------

// NOTE: mock-google endpoint removed — real Google OAuth via better-auth is now used.

// Fetch current logged-in user profile from verification middleware
app.get("/api/auth/me", verifyJWT, (req, res) => {
  res.json({ user: req.user });
});

// Route to get a JWT token for standard login users
// Since standard Better Auth client uses cookies, we provide an endpoint
// for the client to retrieve the JWT token on successful email/password sign-in.
app.get("/api/auth/jwt-token", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Generate custom JWT token signed with BETTER_AUTH_SECRET
    const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);
    const jwtToken = await new SignJWT({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ message: "Error generating token" });
  }
});

// ----------------------------------------------------
// Better Auth Router & Global Body Parser
// ----------------------------------------------------

// Mount Better Auth router BEFORE global express.json() body parser
// to avoid request hanging.
app.all("/api/auth/*", toNodeHandler(auth));

// Body parser for all other custom routes
app.use(express.json());


// ----------------------------------------------------
// Tutor Routes (CRUD & Filters)
// ----------------------------------------------------

// Get tutors (Public)
// Supports search by name (case-insensitive regex),
// filter by session start date ($gte and $lte),
// and limit (e.g. displaying 6 tutors on home page).
app.get("/api/tutors", async (req, res) => {
  try {
    const { search, startDate, endDate, limit } = req.query;
    const query = {};

    // 1. Search by name (case-insensitive regex)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 2. Filter by sessionStartDate ($gte, $lte)
    // Front-end sends startDate/endDate as string YYYY-MM-DD
    if (startDate || endDate) {
      query.sessionStartDate = {};
      if (startDate) {
        query.sessionStartDate.$gte = startDate; // Direct string comparison works since format is YYYY-MM-DD
      }
      if (endDate) {
        query.sessionStartDate.$lte = endDate;
      }
    }

    let cursor = db.collection("tutors").find(query);

    // 3. Limit operator
    if (limit) {
      cursor = cursor.limit(parseInt(limit, 10));
    }

    const tutorsList = await cursor.toArray();
    res.json(tutorsList);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: "Internal server error fetching tutors", error: error.message });
  }
});

// Get single tutor details (Public)
app.get("/api/tutors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Tutor ID" });
    }

    const tutor = await db.collection("tutors").findOne({ _id: new ObjectId(id) });
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json(tutor);
  } catch (error) {
    console.error("Error fetching tutor details:", error);
    res.status(500).json({ message: "Internal server error fetching tutor", error: error.message });
  }
});

// Create tutor (Private - requires JWT)
app.post("/api/tutors", verifyJWT, async (req, res) => {
  try {
    const {
      name,
      photo,
      subject,
      availableDays,
      availableTime,
      hourlyFee,
      totalSlot,
      sessionStartDate,
      institution,
      experience,
      location,
      teachingMode
    } = req.body;

    // Validation
    if (!name || !subject || !sessionStartDate || hourlyFee === undefined || totalSlot === undefined) {
      return res.status(400).json({ 
        message: "Required fields are missing: Name, Subject, Start Date, Hourly Fee, Total Slot." 
      });
    }

    // Validate hourlyFee is a positive number
    if (isNaN(hourlyFee) || parseFloat(hourlyFee) <= 0) {
      return res.status(400).json({ message: "Hourly Fee must be a positive number." });
    }

    // Validate totalSlot is a positive number
    if (isNaN(totalSlot) || parseInt(totalSlot, 10) < 0) {
      return res.status(400).json({ message: "Total Slot must be a non-negative number." });
    }

    // Validate sessionStartDate format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(sessionStartDate)) {
      return res.status(400).json({ message: "Session Start Date must be in YYYY-MM-DD format." });
    }

    const newTutor = {
      userId: req.user.id,  // Add userId for ownership tracking
      name,
      photo: photo || "https://via.placeholder.com/150",
      subject,
      availableDays: availableDays || "Flexible",
      availableTime: availableTime || "Flexible",
      hourlyFee: parseFloat(hourlyFee),
      totalSlot: parseInt(totalSlot, 10),
      sessionStartDate, // YYYY-MM-DD
      institution: institution || "N/A",
      experience: experience || "N/A",
      location: location || "Remote",
      teachingMode: teachingMode || "Online",
      ownerEmail: req.user.email,
      ownerName: req.user.name || "Anonymous User",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("tutors").insertOne(newTutor);
    const createdTutor = await db.collection("tutors").findOne({ _id: result.insertedId });

    res.status(201).json({ 
      message: "Tutor created successfully", 
      tutor: createdTutor 
    });
  } catch (error) {
    console.error("Error creating tutor:", error);
    res.status(500).json({ 
      message: "Internal server error creating tutor", 
      error: error.message 
    });
  }
});

// Get tutors created by the logged-in user (Private)
app.get("/api/my-tutors", verifyJWT, async (req, res) => {
  try {
    const tutorsList = await db.collection("tutors")
      .find({ ownerEmail: req.user.email })
      .toArray();
    res.json(tutorsList);
  } catch (error) {
    console.error("Error fetching my tutors:", error);
    res.status(500).json({ message: "Internal server error fetching my tutors", error: error.message });
  }
});

// Update tutor (Private & Owner verified)
app.put("/api/tutors/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Tutor ID" });
    }

    const tutor = await db.collection("tutors").findOne({ _id: new ObjectId(id) });
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Verify ownership
    if (tutor.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this tutor profile" });
    }

    const {
      name,
      photo,
      subject,
      availableDays,
      availableTime,
      hourlyFee,
      totalSlot,
      sessionStartDate,
      institution,
      experience,
      location,
      teachingMode
    } = req.body;

    const updatedData = {
      name: name || tutor.name,
      photo: photo || tutor.photo,
      subject: subject || tutor.subject,
      availableDays: availableDays || tutor.availableDays,
      availableTime: availableTime || tutor.availableTime,
      hourlyFee: hourlyFee !== undefined ? parseFloat(hourlyFee) : tutor.hourlyFee,
      totalSlot: totalSlot !== undefined ? parseInt(totalSlot, 10) : tutor.totalSlot,
      sessionStartDate: sessionStartDate || tutor.sessionStartDate,
      institution: institution || tutor.institution,
      experience: experience || tutor.experience,
      location: location || tutor.location,
      teachingMode: teachingMode || tutor.teachingMode,
      updatedAt: new Date()
    };

    await db.collection("tutors").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    const updatedTutor = await db.collection("tutors").findOne({ _id: new ObjectId(id) });
    res.json({ message: "Tutor updated successfully", tutor: updatedTutor });

  } catch (error) {
    console.error("Error updating tutor:", error);
    res.status(500).json({ message: "Internal server error updating tutor", error: error.message });
  }
});

// Delete tutor (Private & Owner verified)
app.delete("/api/tutors/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Tutor ID" });
    }

    const tutor = await db.collection("tutors").findOne({ _id: new ObjectId(id) });
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Verify ownership
    if (tutor.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this tutor profile" });
    }

    await db.collection("tutors").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Tutor deleted successfully" });

  } catch (error) {
    console.error("Error deleting tutor:", error);
    res.status(500).json({ message: "Internal server error deleting tutor", error: error.message });
  }
});


// ----------------------------------------------------
// Booking Routes (Private & Validations)
// ----------------------------------------------------

// Create booking (Private)
app.post("/api/bookings", verifyJWT, async (req, res) => {
  try {
    const { tutorId, studentPhone } = req.body;
    if (!tutorId || !studentPhone) {
      return res.status(400).json({ message: "Tutor ID and Student Phone number are required." });
    }

    if (!ObjectId.isValid(tutorId)) {
      return res.status(400).json({ message: "Invalid Tutor ID" });
    }

    // Validate phone number format (basic validation)
    if (!/^\d{10,15}$/.test(studentPhone.replace(/\D/g, ""))) {
      return res.status(400).json({ message: "Invalid phone number format." });
    }

    const tutor = await db.collection("tutors").findOne({ _id: new ObjectId(tutorId) });
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // 1. Slot Availability Check
    if (tutor.totalSlot === undefined || tutor.totalSlot <= 0) {
      return res.status(400).json({ message: "No available slots left." });
    }

    // 2. Session Date Restriction Check
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const sessionDate = new Date(tutor.sessionStartDate);
    sessionDate.setHours(0, 0, 0, 0);

    if (now < sessionDate) {
      return res.status(400).json({ message: "Booking is not available yet for this tutor" });
    }

    // 3. Decrement slot by 1
    const updateResult = await db.collection("tutors").updateOne(
      { _id: new ObjectId(tutorId), totalSlot: { $gt: 0 } },
      { $inc: { totalSlot: -1 } }
    );

    if (updateResult.modifiedCount === 0) {
      // Re-verify slot limit in case of race condition
      return res.status(400).json({ message: "This session is fully booked. You can’t join at the moment." });
    }

    // 4. Generate unique session token
    const sessionToken = generateSessionToken();

    // 5. Create booking document
    const newBooking = {
      tutorId: tutorId,
      tutorName: tutor.name,
      studentName: req.user.name || "Anonymous Student",
      studentEmail: req.user.email,
      studentPhone: studentPhone,
      status: "booked", // auto-generated status
      sessionToken: sessionToken, // Digital session token
      bookingDate: new Date(),
      createdAt: new Date()
    };

    const bookingResult = await db.collection("bookings").insertOne(newBooking);
    const createdBooking = await db.collection("bookings").findOne({ _id: bookingResult.insertedId });

    res.status(201).json({ message: "Booking completed successfully", booking: createdBooking });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error booking session", error: error.message });
  }
});

// Get user's booked sessions (Private)
app.get("/api/bookings", verifyJWT, async (req, res) => {
  try {
    const bookings = await db.collection("bookings")
      .find({ studentEmail: req.user.email })
      .toArray();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error fetching bookings", error: error.message });
  }
});

// Cancel booking (Private - PATCH)
app.patch("/api/bookings/:id/cancel", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Booking ID" });
    }

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify ownership
    if (booking.studentEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Update status to "cancelled"
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "cancelled" } }
    );

    // Optionally increment slot back for the tutor
    if (ObjectId.isValid(booking.tutorId)) {
      await db.collection("tutors").updateOne(
        { _id: new ObjectId(booking.tutorId) },
        { $inc: { totalSlot: 1 } }
      );
    }

    res.json({ message: "Booking status updated to cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error cancelling booking", error: error.message });
  }
});

// Alternative endpoint: Cancel booking by PATCH (without /cancel suffix)
app.patch("/api/bookings/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Booking ID" });
    }

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify ownership
    if (booking.studentEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to update this booking" });
    }

    if (status === "cancelled" && booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Update status
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status || "cancelled", updatedAt: new Date() } }
    );

    // If cancelling, increment slot back for the tutor
    if ((status || "cancelled") === "cancelled" && booking.status !== "cancelled") {
      if (ObjectId.isValid(booking.tutorId)) {
        await db.collection("tutors").updateOne(
          { _id: new ObjectId(booking.tutorId) },
          { $inc: { totalSlot: 1 } }
        );
      }
    }

    const updatedBooking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    res.json({ message: "Booking updated successfully", booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error updating booking", error: error.message });
  }
});

// Get tutors created by specific user (Private)
app.get("/api/tutors/user/:userId", verifyJWT, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const tutorsList = await db.collection("tutors")
      .find({ userId: userId })
      .toArray();

    res.json(tutorsList);
  } catch (error) {
    console.error("Error fetching user tutors:", error);
    res.status(500).json({ message: "Internal server error fetching tutors", error: error.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
