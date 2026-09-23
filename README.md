# AestheticAI — Full-Stack Hairstyle Recommendation System 💇‍♂️🤖

An intelligent, full-stack biometric application utilizing client-side TensorFlow.js deep learning (`@vladmandic/face-api`) for real-time 68-point facial landmark extraction, coupled with a Node.js + Express + MongoDB backend engine for dynamic hairstyle recommendation catalog matching, JWT authentication, user scan history, and recommendation feedback.

---

## 🚀 Key Features

* **In-Browser Facial Topology Extraction:** Client-side 68-point neural network mapping (`TinyFaceDetector` & `Landmark68Net`) ensuring privacy and instantaneous landmark analysis.
* **Full-Stack Database Architecture:** MongoDB collection matrix housing curated hairstyle catalogs across face shapes (`Oval`, `Round`, `Square`, `Heart`, `Oblong/Rectangle`).
* **JWT User Authentication:** Secure user registration, sign-in, and persistent session state with hashed passwords (`bcryptjs`).
* **Scan History & Feedback Loop:** Persistent tracking of user facial scan histories with interactive like/dislike feedback ratings and comments.
* **Containerized Deployment:** Docker Compose orchestration combining MongoDB, Node/Express backend, and Vite React frontend.

---

## 🛠️ Tech Stack & System Architecture

```text
[Browser Upload] ───> [face-api.js (Landmarks)] ───> [POST /api/scans] ───> [MongoDB Catalog Query]
                                                                                │
                                                                                ▼
[Scan History & Feedback] <─── [Auth Context & JWT] <─── [Express API] <─── [Hairstyle Match Matrix]
```

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Vanilla CSS + Tailwind CSS v4 & Lucide Icons
- **Biometrics:** `@vladmandic/face-api` (TensorFlow.js WebGL backend)

### Backend
- **Runtime:** Node.js & Express (TypeScript)
- **Database:** MongoDB & Mongoose ORM
- **Authentication:** JWT (JSON Web Tokens) & `bcryptjs`
- **Uploads:** Multer with Cloudinary & Local Storage fallback
- **Security:** `cors`, `morgan`, `express-rate-limit`

---

## 📦 Quick Start & Local Execution

### Option A: Local Development (Node.js & MongoDB)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vibhavjain03/hairstyle-recommendation-system.git
   cd hairstyle-recommendation-system
   ```

2. **Start Backend Server:**
   ```bash
   cd server
   npm install
   npm run seed    # Seed database with 20 curated hairstyles
   npm run dev     # Runs Express backend on http://localhost:5000
   ```

3. **Start Frontend App:**
   In a second terminal window at the project root:
   ```bash
   npm install
   npm run dev     # Runs Vite React frontend on http://localhost:5173
   ```

### Option B: One-Command Docker Compose Deployment

Run the complete multi-container stack (MongoDB + Express Backend + Vite Nginx Frontend) with:
```bash
docker-compose up --build
```
Access the application at `http://localhost`.

---

## 📄 License
MIT License.
