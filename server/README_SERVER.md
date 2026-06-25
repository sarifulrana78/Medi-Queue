# MediQueue Server - Express.js Backend

Express.js backend for the MediQueue tutor booking system. This API handles authentication, tutor management, and booking operations.

## 🚀 Live API URL

[mediqueue-api.onrender.com](https://mediqueue-api.onrender.com)

## ✨ Features

- **JWT Authentication**: Secure token-based authentication
- **Better Auth Integration**: Email/password and OAuth support
- **Tutor Management**: CRUD operations for tutors
- **Booking System**: Create and manage bookings
- **Search & Filter**: Advanced query support with MongoDB aggregation
- **CORS Enabled**: Configured for frontend integration
- **MongoDB Integration**: Scalable database solution

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Better Auth + JWT (jose)
- **Security**: CORS, JWT verification
- **Environment**: Node.js

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mediqueue-server.git
cd mediqueue-server

# Install dependencies
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://127.0.0.1:27017/mediqueue
# BETTER_AUTH_SECRET=your_secret_key
# BETTER_AUTH_URL=http://localhost:5000
# CLIENT_URL=http://localhost:3000

# Start development server
npm run dev
```

API runs on `http://localhost:5000`

## 📝 Environment Variables

Create `.env`:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/mediqueue

# Authentication
BETTER_AUTH_SECRET=your_super_secret_key
BETTER_AUTH_URL=http://localhost:5000

# Client Configuration (for CORS)
CLIENT_URL=http://localhost:3000
```

For production (Render):
```env
MONGODB_URI=your_mongodb_atlas_uri
CLIENT_URL=https://mediqueue.vercel.app
```

## 📁 Project Structure

```
├── index.js              # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
├── lib/
│   └── auth.js          # Better Auth setup
├── middleware/
│   └── verifyJWT.js     # JWT verification
└── seed.js              # Database seeding (optional)
```

## 🔧 Available Scripts

```bash
npm start    # Start production server
npm run dev  # Start development server with nodemon
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/*` - Better Auth routes
- `POST /api/auth/mock-google` - Mock Google login

### Tutors
- `GET /api/tutors` - Get all tutors (with search & filter)
- `GET /api/tutors/:id` - Get tutor by ID
- `POST /api/tutors` - Create tutor (protected)
- `PUT /api/tutors/:id` - Update tutor (protected)
- `DELETE /api/tutors/:id` - Delete tutor (protected)

### Bookings
- `GET /api/bookings` - Get user's bookings (protected)
- `POST /api/bookings` - Create booking (protected)
- `PATCH /api/bookings/:id` - Update booking (protected)

## 🔐 Authentication

### JWT Token
- Created on login
- Stored in `localStorage` on client
- Sent in `Authorization: Bearer <token>` header
- Verified on protected routes

### CORS Configuration
```javascript
cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
})
```

## 📊 Database Schema

### Users
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  password: String,
  photoURL: String,
  createdAt: Date
}
```

### Tutors
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  photoURL: String,
  subject: String,
  availableDays: String,
  availableTime: String,
  hourlyFee: Number,
  totalSlot: Number,
  sessionStartDate: Date,
  institution: String,
  experience: String,
  location: String,
  teachingMode: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  tutorId: ObjectId,
  studentName: String,
  studentEmail: String,
  tutorName: String,
  phoneNumber: String,
  status: String,
  bookingDate: Date,
  sessionToken: String,
  createdAt: Date
}
```

## 🚀 Deployment on Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables in Render dashboard
5. Deploy!

## 🔗 Client Integration

Client connects via `NEXT_PUBLIC_API_URL` environment variable:

```javascript
// Client .env.local
NEXT_PUBLIC_API_URL=https://your-render-server-url
```

## 📝 Middleware

### JWT Verification
```javascript
import { verifyJWT } from './middleware/verifyJWT.js';

// Protect routes
app.get('/api/protected', verifyJWT, (req, res) => {
  // req.user contains decoded JWT
});
```

## 🧪 Testing

Test API endpoints with:
- Postman
- Thunder Client
- Insomnia

## 🤝 Contributing

Please follow REST conventions and existing code patterns.

## 📄 License

MIT License

## 👤 Author

Rana Gautam
