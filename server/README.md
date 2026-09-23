# Hairstyle Recommendation System — Backend Service 💇‍♂️⚡

A Node.js + Express + TypeScript backend connected to MongoDB via Mongoose. Handles JWT user authentication, file uploads, face scan persistence, hairstyle catalog queries, and recommendation feedback.

---

## 🛠️ Architecture & Tech Stack

- **Runtime:** Node.js (TypeScript ES2022)
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose ORM
- **Authentication:** JWT (JSON Web Tokens) + `bcryptjs` password hashing
- **File Storage:** Multer + Cloudinary (with local disk fallback in `/uploads`)
- **Logging & Security:** `morgan`, `cors`, `express-rate-limit`

---

## 🚀 Setup & Local Running

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env`):**
   Copy `.env.example` to `.env` and fill in values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/hairstyle_recommendation
   JWT_SECRET=supersecret_hairstyle_jwt_key_2026
   NODE_ENV=development
   ```

4. **Seed Database with Hairstyle Catalog:**
   ```bash
   npm run seed
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The backend runs on `http://localhost:5000`.

---

## 📚 API Endpoint Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |

#### Request Example (`POST /api/auth/register`):
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

#### Response Example:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "67a123...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

---

### 📷 Face Scans & Recommendations (`/api/scans`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/scans` | Public/Optional | Process upload/base64 image & landmarks, return recommendations |
| `GET` | `/api/scans/history` | Private | Retrieve logged-in user's past scans |

#### Request Example (`POST /api/scans`):
*Form-Data or JSON Body:*
- `image`: File (multipart) or `imageUrl` (string base64/URL)
- `detectedFaceShape`: `"Oval"` | `"Round"` | `"Square"` | `"Heart"` | `"Oblong"`
- `landmarkData`: JSON string or Object of 68-point landmarks
- `metrics`: JSON string or Object of biometric dimensions

#### Response Example:
```json
{
  "success": true,
  "data": {
    "scan": {
      "_id": "67b987...",
      "detectedFaceShape": "Square",
      "uploadedImageUrl": "/uploads/scan-170000.jpg"
    },
    "styles": ["Short Back & Sides Fade", "Textured Comb Over", "Induction Buzz Cut"],
    "groomingTips": "Keep the sides tight to emphasize your strong jawline.",
    "hairstylesFull": [...]
  }
}
```

---

### 💈 Hairstyle Catalog (`/api/hairstyles`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/hairstyles` | Public | List & filter catalog by `shape`, `gender`, or `tag` |
| `POST` | `/api/hairstyles` | Private (Admin) | Create a new hairstyle catalog entry |

---

### 💬 Recommendation Feedback (`/api/feedback`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/feedback` | Public/Optional | Submit like/dislike rating & optional comment |
| `GET` | `/api/feedback/:recommendationId` | Public | Get feedback history for a recommendation |

#### Request Example (`POST /api/feedback`):
```json
{
  "recommendationId": "67c456...",
  "liked": true,
  "comment": "The textured comb over was a great suggestion!"
}
```
