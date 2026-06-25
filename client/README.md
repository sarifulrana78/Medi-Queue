# MediQueue – Tutor Booking System

**Live Site URL**: [https://mediqueue.vercel.app](https://mediqueue.vercel.app)

MediQueue is a modern tutor booking web application where students can register, log in, browse available tutors, and book online or offline learning sessions based on subject and time availability.

---

## ✨ Key Features

- 🔐 **Secure JWT Authentication** — Email/password and Google OAuth login powered by Better Auth. JWT tokens are stored client-side and sent with every private API request for stateless, secure authorization.

- 📅 **Conflict-Free Session Booking** — Each tutor has a defined slot count and session start date. The system automatically blocks bookings when slots run out or the session hasn't started yet, and decrements slots in real time on each successful booking.

- 🔍 **Search & Date Filter** — Browse tutors using a live case-insensitive name search (`$regex`) and filter by session start date range (`$gte` / `$lte`) directly against the MongoDB database.

- 🎛️ **Full Tutor & Booking Management** — Logged-in users can create, edit (via pre-filled modal), and delete their tutor profiles without page reloads. Students can view and cancel their booked sessions from a dedicated dashboard.

- 🌓 **Dark / Light Theme Toggle** — A persistent theme switcher in the navbar lets users switch between dark and light modes across the entire application, with preference saved to `localStorage`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Routing | React Router DOM v7 |
| HTTP | Axios |
| Auth | Better Auth + JWT (jose) |
| Notifications | SweetAlert2 |
| Icons | Lucide React + React Icons |

---

## 🚀 Getting Started (Local Development)

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/       # Layout, Navbar, Footer, DynamicTitle
├── context/          # AuthContext (user state + auth methods)
├── lib/              # Axios instance, better-auth client
├── pages/            # Home, Tutors, TutorDetails, AddTutor,
│                     # MyTutors, MyBookings, Login, Register,
│                     # AuthCallback, NotFound, ErrorBoundary
└── routes/           # PrivateRoute wrapper
```

---

## 🌐 Deployment

- **Client** → [Vercel](https://vercel.com)
- **Server** → [Render](https://render.com)
- **Database** → MongoDB Atlas
