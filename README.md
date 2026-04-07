# 🗺️ GroupTripFinder

A full-stack Group Trip Planner — React Vite + Tailwind CSS frontend, Express + MongoDB backend with MVC architecture.

---

## 🚀 Tech Stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router v6  |
| Backend   | Node.js, Express 4, MongoDB, Mongoose          |
| Auth      | JWT (jsonwebtoken) + bcryptjs password hashing |
| HTTP      | Axios with interceptors                        |
| Toasts    | react-hot-toast                                |
| Icons     | lucide-react                                   |

---

## 📁 Project Structure

```
group-trip-finder/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # signup, login, getMe
│   │   └── groupController.js # CRUD + destination logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # User schema (bcrypt hashed)
│   │   └── Group.js           # Group + members schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── groupRoutes.js
│   ├── server.js              # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance + interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Spinner.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state + login/signup/logout
    │   ├── pages/
    │   │   ├── HomePage.jsx       # Landing page
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── CreateGroupPage.jsx
    │   │   ├── AddMembersPage.jsx
    │   │   └── ResultsPage.jsx
    │   ├── App.jsx                # Router + layout
    │   ├── main.jsx
    │   └── index.css              # Tailwind + custom CSS
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) OR a MongoDB Atlas URI

---

### 1. Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/grouptripfinder
JWT_SECRET=change_this_to_a_long_random_secret
```

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies `/api` → `http://localhost:5000` automatically.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint           | Access  | Description        |
|--------|--------------------|---------|--------------------|
| POST   | /api/auth/signup   | Public  | Register new user  |
| POST   | /api/auth/login    | Public  | Login user         |
| GET    | /api/auth/me       | Private | Get current user   |

### Groups
| Method | Endpoint                            | Access  | Description                  |
|--------|-------------------------------------|---------|------------------------------|
| GET    | /api/groups                         | Private | Get all user's groups        |
| POST   | /api/groups                         | Private | Create a group               |
| GET    | /api/groups/:id                     | Private | Get single group             |
| DELETE | /api/groups/:id                     | Private | Delete a group               |
| POST   | /api/groups/:id/members             | Private | Add member to group          |
| DELETE | /api/groups/:id/members/:memberId   | Private | Remove member from group     |
| GET    | /api/groups/:id/destinations        | Private | Get ranked destinations      |

---

## 🌏 Features

- ✅ **JWT Auth** — Signup/Login with secure bcrypt hashed passwords
- ✅ **MVC Backend** — Clean separation: Models → Controllers → Routes
- ✅ **MongoDB** — Mongoose schemas with virtuals (avgBudget, memberCount)
- ✅ **Smart Destinations** — 5 curated Indian destinations scored by avg budget
- ✅ **Hotels** — 3 hotel recommendations per destination
- ✅ **React + Tailwind** — Beautiful responsive UI with animations
- ✅ **Protected Routes** — JWT-guarded pages in React
- ✅ **Toast Notifications** — User-friendly feedback
- ✅ **3-Step Wizard** — Create Group → Add Members → View Results

---

## 🧠 Destination Scoring Logic

The backend calculates:
- **Trip duration** from start/end dates
- **Average budget** across all members  
- **Total cost** = `costPerDay × tripDays × memberCount`
- **Score** = how well the avg budget fits the destination's budget range (0–100%)
- Results sorted by score descending — best match shown first

---

## 🛠 Production Build

```bash
cd frontend
npm run build
# Outputs to frontend/dist/
# Serve dist/ with any static server or your Express backend
```

---

© 2026 GroupTripFinder
