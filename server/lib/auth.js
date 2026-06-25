import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt, bearer } from "better-auth/plugins";
import dotenv from "dotenv";

dotenv.config();

let client;
let db;

try {
  console.log("Attempting to connect to MongoDB Atlas...");
  client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  });
  await client.connect();
  db = client.db();
  console.log("✅ Connected to MongoDB Atlas successfully!");
} catch (error) {
  console.warn("⚠️ MongoDB Atlas connection failed. Falling back to local in-memory MongoDB...", error.message);
  
  const { MongoMemoryReplSet } = await import("mongodb-memory-server");
  const { mockTutors } = await import("../seed.js");
  
  // Use a replica set so better-auth transactions work
  const mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 }
  });
  await mongoServer.waitUntilRunning();
  const localUri = mongoServer.getUri();
  console.log(`ℹ️ In-memory MongoDB Replica Set started at: ${localUri}`);
  
  client = new MongoClient(localUri);
  await client.connect();
  db = client.db("mediqueue");
  
  console.log("🌱 Seeding in-memory database with mock tutors...");
  const count = await db.collection("tutors").countDocuments();
  if (count === 0) {
    await db.collection("tutors").insertMany(mockTutors);
    console.log(`✅ Seeded ${mockTutors.length} tutor profiles!`);
  }
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },
  plugins: [
    jwt(),
    bearer()
  ],
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
});

export { client, db };
