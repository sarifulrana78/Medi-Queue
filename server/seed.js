import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mediqueue";
const client = new MongoClient(uri);

export const mockTutors = [
  {
    name: "Dr. Sarah Jenkins",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    subject: "Biology",
    availableDays: "Sun, Tue, Thu",
    availableTime: "04:00 PM - 07:00 PM",
    hourlyFee: 45.0,
    totalSlot: 5,
    sessionStartDate: "2026-06-10", // already started
    institution: "Johns Hopkins University",
    experience: "8 years of Medical Biology tutoring",
    location: "Baltimore, MD",
    teachingMode: "Online",
    ownerEmail: "sarah.jenkins@mediqueue.com",
    ownerName: "Sarah Jenkins",
    createdAt: new Date()
  },
  {
    name: "Prof. Michael Chen",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    subject: "Chemistry",
    availableDays: "Mon, Wed, Fri",
    availableTime: "05:00 PM - 08:00 PM",
    hourlyFee: 50.0,
    totalSlot: 3,
    sessionStartDate: "2026-06-01", // already started
    institution: "Stanford University",
    experience: "12 years teaching Organic Chemistry",
    location: "Palo Alto, CA",
    teachingMode: "Both",
    ownerEmail: "michael.chen@mediqueue.com",
    ownerName: "Michael Chen",
    createdAt: new Date()
  },
  {
    name: "Dr. Elena Rostova",
    photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
    subject: "Physics",
    availableDays: "Sat, Mon, Wed",
    availableTime: "03:00 PM - 06:00 PM",
    hourlyFee: 55.0,
    totalSlot: 0, // Fully booked to test 0 slot block
    sessionStartDate: "2026-06-12",
    institution: "MIT",
    experience: "6 years teaching AP Physics & Calculus",
    location: "Boston, MA",
    teachingMode: "Online",
    ownerEmail: "elena.rostova@mediqueue.com",
    ownerName: "Elena Rostova",
    createdAt: new Date()
  },
  {
    name: "David Miller, MSc",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    subject: "Mathematics",
    availableDays: "Sun - Thu",
    availableTime: "06:00 PM - 09:00 PM",
    hourlyFee: 40.0,
    totalSlot: 8,
    sessionStartDate: "2026-06-15", // already started
    institution: "University of Oxford",
    experience: "5 years teaching Algebra & Calculus",
    location: "Oxford, UK",
    teachingMode: "Online",
    ownerEmail: "david.miller@mediqueue.com",
    ownerName: "David Miller",
    createdAt: new Date()
  },
  {
    name: "Dr. Amanda Ross",
    photo: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
    subject: "English",
    availableDays: "Tue, Thu",
    availableTime: "02:00 PM - 05:00 PM",
    hourlyFee: 35.0,
    totalSlot: 10,
    sessionStartDate: "2026-07-01", // Future session to test start date restriction
    institution: "Columbia University",
    experience: "10 years ESL & Academic Writing guidance",
    location: "New York, NY",
    teachingMode: "Both",
    ownerEmail: "amanda.ross@mediqueue.com",
    ownerName: "Amanda Ross",
    createdAt: new Date()
  },
  {
    name: "Prof. Arthur Pendelton",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    subject: "Spanish",
    availableDays: "Mon, Thu",
    availableTime: "05:00 PM - 07:00 PM",
    hourlyFee: 30.0,
    totalSlot: 4,
    sessionStartDate: "2026-06-05", // already started
    institution: "Universidad de Madrid",
    experience: "15 years conversational Spanish coach",
    location: "Miami, FL",
    teachingMode: "Offline",
    ownerEmail: "arthur.pendelton@mediqueue.com",
    ownerName: "Arthur Pendelton",
    createdAt: new Date()
  },
  {
    name: "Dr. Marcus Vance",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    subject: "Science",
    availableDays: "Sat, Sun",
    availableTime: "10:00 AM - 01:00 PM",
    hourlyFee: 45.0,
    totalSlot: 6,
    sessionStartDate: "2026-06-14",
    institution: "UC Berkeley",
    experience: "7 years tutoring Middle School Science",
    location: "Berkeley, CA",
    teachingMode: "Online",
    ownerEmail: "marcus.vance@mediqueue.com",
    ownerName: "Marcus Vance",
    createdAt: new Date()
  }
];

async function seed() {
  try {
    await client.connect();
    console.log("Connected to MongoDB for seeding...");
    const db = client.db();
    
    // Clear existing tutors
    await db.collection("tutors").deleteMany({});
    console.log("Cleared existing tutors.");

    // Insert mock tutors
    const result = await db.collection("tutors").insertMany(mockTutors);
    console.log(`Successfully seeded ${result.insertedCount} tutor profiles!`);
    
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await client.close();
  }
}

if (process.argv[1] && process.argv[1].includes("seed.js")) {
  seed();
}
