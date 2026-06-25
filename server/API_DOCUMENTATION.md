# MediQueue Server - API Documentation

## 🌐 Base URL

**Development**: `http://localhost:5000`
**Production**: `https://mediqueue-api.onrender.com`

## 📚 Endpoints Overview

### 1. Health Check
```
GET /api/health
```
Check if the server is running.

**Response** (200):
```json
{
  "status": "OK",
  "message": "MediQueue Server is running",
  "timestamp": "2026-06-16T10:30:00.000Z"
}
```

---

## 🔐 Authentication Endpoints

### 1. Better Auth Routes
All Better Auth endpoints are available under `/api/auth/*`

Supported routes:
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/session` - Get current session

### 2. Get JWT Token (After Email/Password Login)
```
GET /api/auth/jwt-token
```
Retrieve JWT token after successful email/password sign-in.

**Headers**:
```
Authorization: Bearer <better-auth-token>
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Mock Google Sign-In
```
POST /api/auth/mock-google
```
Mock Google OAuth login (for testing).

**Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://example.com/image.jpg" // optional
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://example.com/image.jpg"
  }
}
```

### 4. Get Current User Profile
```
GET /api/auth/me
```
Get the profile of the currently logged-in user.

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (200):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://example.com/image.jpg"
  }
}
```

**Error** (401):
```json
{
  "message": "Unauthorized: Missing Bearer token in headers"
}
```

---

## 👨‍🏫 Tutor Endpoints

### 1. Get All Tutors (Public)
```
GET /api/tutors
```
Retrieve all tutors with optional search and filter.

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search tutors by name (case-insensitive) |
| startDate | string | Filter by start date (YYYY-MM-DD, $gte) |
| endDate | string | Filter by end date (YYYY-MM-DD, $lte) |
| limit | number | Limit number of results |

**Example**:
```
GET /api/tutors?search=math&startDate=2026-06-01&endDate=2026-06-30&limit=10
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "Math Expert",
    "photo": "https://example.com/tutor.jpg",
    "subject": "Mathematics",
    "availableDays": "Mon-Fri",
    "availableTime": "3:00 PM - 8:00 PM",
    "hourlyFee": 50,
    "totalSlot": 5,
    "sessionStartDate": "2026-06-01",
    "institution": "XYZ University",
    "experience": "5 years",
    "location": "New York",
    "teachingMode": "Online",
    "ownerEmail": "tutor@example.com",
    "ownerName": "Tutor Name",
    "createdAt": "2026-06-16T10:00:00.000Z",
    "updatedAt": "2026-06-16T10:00:00.000Z"
  }
]
```

### 2. Get Single Tutor Details (Public)
```
GET /api/tutors/:id
```
Retrieve details of a specific tutor.

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Tutor MongoDB ID |

**Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "name": "Math Expert",
  "photo": "https://example.com/tutor.jpg",
  "subject": "Mathematics",
  "availableDays": "Mon-Fri",
  "availableTime": "3:00 PM - 8:00 PM",
  "hourlyFee": 50,
  "totalSlot": 5,
  "sessionStartDate": "2026-06-01",
  "institution": "XYZ University",
  "experience": "5 years",
  "location": "New York",
  "teachingMode": "Online",
  "ownerEmail": "tutor@example.com",
  "ownerName": "Tutor Name",
  "createdAt": "2026-06-16T10:00:00.000Z",
  "updatedAt": "2026-06-16T10:00:00.000Z"
}
```

**Error** (404):
```json
{
  "message": "Tutor not found"
}
```

### 3. Create Tutor (Private)
```
POST /api/tutors
```
Create a new tutor profile. Only logged-in users can create.

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Math Expert",
  "photo": "https://example.com/tutor.jpg",
  "subject": "Mathematics",
  "availableDays": "Mon-Fri",
  "availableTime": "3:00 PM - 8:00 PM",
  "hourlyFee": 50,
  "totalSlot": 10,
  "sessionStartDate": "2026-06-01",
  "institution": "XYZ University",
  "experience": "5 years",
  "location": "New York",
  "teachingMode": "Online"
}
```

**Required Fields**:
- name
- subject
- sessionStartDate (YYYY-MM-DD)
- hourlyFee
- totalSlot

**Response** (201):
```json
{
  "message": "Tutor created successfully",
  "tutor": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "Math Expert",
    "photo": "https://example.com/tutor.jpg",
    "subject": "Mathematics",
    "availableDays": "Mon-Fri",
    "availableTime": "3:00 PM - 8:00 PM",
    "hourlyFee": 50,
    "totalSlot": 10,
    "sessionStartDate": "2026-06-01",
    "institution": "XYZ University",
    "experience": "5 years",
    "location": "New York",
    "teachingMode": "Online",
    "ownerEmail": "user@example.com",
    "ownerName": "John Doe",
    "createdAt": "2026-06-16T10:00:00.000Z",
    "updatedAt": "2026-06-16T10:00:00.000Z"
  }
}
```

### 4. Get My Tutors (Private)
```
GET /api/tutors/user/:userId
```
Get tutors created by a specific user.

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "Math Expert",
    ...
  }
]
```

### 5. Alternative: Get My Tutors (Private)
```
GET /api/my-tutors
```
Get all tutors created by the logged-in user (using email).

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "Math Expert",
    ...
  }
]
```

### 6. Update Tutor (Private)
```
PUT /api/tutors/:id
```
Update tutor details. Only the tutor owner can update.

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Tutor MongoDB ID |

**Body** (all fields optional):
```json
{
  "name": "Updated Math Expert",
  "photo": "https://example.com/new-tutor.jpg",
  "subject": "Mathematics",
  "availableDays": "Mon-Sat",
  "availableTime": "2:00 PM - 9:00 PM",
  "hourlyFee": 60,
  "totalSlot": 15,
  "sessionStartDate": "2026-07-01",
  "institution": "ABC University",
  "experience": "6 years",
  "location": "Boston",
  "teachingMode": "Both"
}
```

**Response** (200):
```json
{
  "message": "Tutor updated successfully",
  "tutor": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "Updated Math Expert",
    ...
  }
}
```

**Error** (403):
```json
{
  "message": "Forbidden: You are not the owner of this tutor profile"
}
```

### 7. Delete Tutor (Private)
```
DELETE /api/tutors/:id
```
Delete a tutor profile. Only the tutor owner can delete.

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Tutor MongoDB ID |

**Response** (200):
```json
{
  "message": "Tutor deleted successfully"
}
```

---

## 📅 Booking Endpoints

### 1. Create Booking (Private)
```
POST /api/bookings
```
Create a new booking for a tutor session.

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body**:
```json
{
  "tutorId": "507f1f77bcf86cd799439011",
  "studentPhone": "1234567890"
}
```

**Validations**:
1. Tutor must exist
2. Tutor must have available slots (totalSlot > 0)
3. Current date must be >= Session Start Date
4. Phone number must be 10-15 digits

**Response** (201):
```json
{
  "message": "Booking completed successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439012",
    "tutorId": "507f1f77bcf86cd799439011",
    "tutorName": "Math Expert",
    "studentName": "John Doe",
    "studentEmail": "student@example.com",
    "studentPhone": "1234567890",
    "status": "booked",
    "sessionToken": "SESSION_A1B2C3D4E5F6G7H8",
    "bookingDate": "2026-06-16T10:00:00.000Z",
    "createdAt": "2026-06-16T10:00:00.000Z"
  }
}
```

**Error** (400):
```json
{
  "message": "No available slots left."
}
```

or

```json
{
  "message": "Booking is not available yet for this tutor"
}
```

or

```json
{
  "message": "This session is fully booked. You can't join at the moment."
}
```

### 2. Get My Bookings (Private)
```
GET /api/bookings
```
Retrieve all bookings made by the logged-in user.

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "tutorId": "507f1f77bcf86cd799439011",
    "tutorName": "Math Expert",
    "studentName": "John Doe",
    "studentEmail": "student@example.com",
    "studentPhone": "1234567890",
    "status": "booked",
    "sessionToken": "SESSION_A1B2C3D4E5F6G7H8",
    "bookingDate": "2026-06-16T10:00:00.000Z",
    "createdAt": "2026-06-16T10:00:00.000Z"
  }
]
```

### 3. Cancel Booking (Private) - Method 1
```
PATCH /api/bookings/:id/cancel
```
Cancel a booking. Only the booking owner can cancel.

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Booking MongoDB ID |

**Response** (200):
```json
{
  "message": "Booking status updated to cancelled"
}
```

### 4. Update Booking (Private) - Method 2
```
PATCH /api/bookings/:id
```
Update booking status. Can be used to cancel or update status.

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Booking MongoDB ID |

**Body**:
```json
{
  "status": "cancelled"
}
```

**Response** (200):
```json
{
  "message": "Booking updated successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439012",
    "tutorId": "507f1f77bcf86cd799439011",
    "tutorName": "Math Expert",
    "studentName": "John Doe",
    "studentEmail": "student@example.com",
    "studentPhone": "1234567890",
    "status": "cancelled",
    "sessionToken": "SESSION_A1B2C3D4E5F6G7H8",
    "bookingDate": "2026-06-16T10:00:00.000Z",
    "updatedAt": "2026-06-16T11:00:00.000Z",
    "createdAt": "2026-06-16T10:00:00.000Z"
  }
}
```

---

## 🔑 Authentication Headers

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### How to Get Token:

1. **After Email/Password Sign-In**:
   ```
   GET /api/auth/jwt-token
   ```

2. **After Google Sign-In**:
   ```
   POST /api/auth/mock-google
   ```
   Returns token in response

---

## 📊 Data Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  password: String (hashed),
  image: String,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Tutor
```javascript
{
  _id: ObjectId,
  userId: String,
  name: String,
  photo: String,
  subject: String,
  availableDays: String,
  availableTime: String,
  hourlyFee: Number,
  totalSlot: Number,
  sessionStartDate: String (YYYY-MM-DD),
  institution: String,
  experience: String,
  location: String,
  teachingMode: String,
  ownerEmail: String,
  ownerName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  _id: ObjectId,
  tutorId: String,
  tutorName: String,
  studentName: String,
  studentEmail: String,
  studentPhone: String,
  status: String (booked/cancelled),
  sessionToken: String,
  bookingDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚨 Error Codes

| Code | Message |
|------|---------|
| 400 | Bad Request - Invalid input or missing required fields |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - You don't have permission to access this resource |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

---

## 💡 Usage Examples

### Example 1: Create Tutor and Get Bookings

```bash
# 1. Login to get JWT token
curl -X POST http://localhost:5000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get JWT token
curl -X GET http://localhost:5000/api/auth/jwt-token \
  -H "Authorization: Bearer <better-auth-token>"

# 2. Create a tutor
curl -X POST http://localhost:5000/api/tutors \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Math Tutor",
    "subject":"Mathematics",
    "sessionStartDate":"2026-06-20",
    "hourlyFee":50,
    "totalSlot":5
  }'

# 3. View all tutors
curl -X GET "http://localhost:5000/api/tutors?limit=10"

# 4. Book a session
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tutorId":"<tutor-id>",
    "studentPhone":"1234567890"
  }'

# 5. View my bookings
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <jwt-token>"

# 6. Cancel a booking
curl -X PATCH http://localhost:5000/api/bookings/<booking-id>/cancel \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 📝 Notes

- All dates should be in **YYYY-MM-DD** format
- Session tokens are auto-generated (format: SESSION_XXXXX)
- Slots automatically decrement when booking is made
- Slots automatically increment when booking is cancelled
- Only tutor owners can update/delete their profiles
- Only booking owners can cancel their bookings
- All timestamps are in ISO 8601 format (UTC)

---

**Last Updated**: 2026-06-16
