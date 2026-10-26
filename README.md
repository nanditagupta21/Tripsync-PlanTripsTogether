# 🗺️ TripSync — Plan Trips Together

**An AI-powered full-stack group travel planner** that helps friends plan trips together based on their budgets, starting cities, and travel preferences.

🌐 **Live Website:** https://tripsync-frontend-zc01.onrender.com/  
💻 **GitHub Repository:** https://github.com/nanditagupta21/Tripsync-PlanTripsTogether

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs password hashing |
| API Communication | Axios with interceptors |
| AI Integration | Google Gemini API |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Deployment | Render |

---

## ✨ Features

- 🔐 **Secure Authentication** — User signup and login with JWT authentication and bcrypt password hashing.
- 📧 **Duplicate Account Prevention** — Checks existing email addresses to prevent duplicate registrations.
- 👥 **Group Trip Planning** — Create a group and add multiple members to plan a trip together.
- 💰 **Budget-Based Recommendations** — Recommends destinations based on the group's average budget.
- 🤖 **AI-Powered Trip Recommendations** — Uses Google Gemini to suggest destinations based on budget, starting cities, and travel preferences.
- 🚆 **Member-Wise Travel Cost Estimates** — Provides approximate transportation cost breakdowns for group members travelling from different cities.
- 🏝️ **Destination Suggestions** — Explore Indian destinations such as Goa, Jaipur, Rishikesh, Manali, and Kerala.
- 🏨 **Hotel Recommendations** — Displays hotel suggestions for destinations.
- 🗓️ **Trip Planning** — Supports trip dates and duration-based cost estimates.
- 🔎 **Destination Matching** — Scores and ranks destinations based on budget suitability and preferences.
- 🔒 **Protected Routes** — Restricts authenticated pages to logged-in users.
- 📱 **Responsive Interface** — React-based interface designed for convenient trip planning.
- 🔔 **Toast Notifications** — Provides feedback for actions such as signup, login, and group creation.

---

## 🧰 How TripSync Works

1. **Create an account** or log in.
2. **Create a trip group** and enter the trip details.
3. **Add members** with their starting cities and budgets.
4. **Choose travel preferences**, such as mountains, beaches, cafes, or adventure activities.
5. **Get recommendations** based on the group details and AI-generated suggestions.
6. **Compare estimated costs** and explore destinations to help plan the trip together.

---

## 🧠 Recommendation and Cost Logic

### Budget-Based Destination Matching

TripSync uses group budget information to help identify suitable destinations. Destination matching can consider the average group budget and the estimated destination cost.

### AI-Powered Recommendations

The backend sends the group's budget, starting cities, and preferences to the Google Gemini API. The AI generates destination suggestions with supporting details such as activities, approximate costs, and itinerary ideas.

### Member-Wise Transportation Estimates

Members may start their journeys from different cities. TripSync provides approximate transportation cost estimates to help the group understand how travel expenses may differ by member.

> **Note:** Transportation costs and AI-generated budget estimates are indicative, not guaranteed live fares. Actual costs may vary depending on travel dates, availability, and transportation mode.

---

## 🏗️ Project Structure

```text
Tripsync-PlanTripsTogether/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── groupController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Group.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── groupRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/
│   │   └── transportCosts.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

---

## ⚙️ Setup and Installation

### Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas database
- Google Gemini API key for AI recommendations

### 1. Clone the Repository

```bash
git clone https://github.com/nanditagupta21/Tripsync-PlanTripsTogether.git
cd Tripsync-PlanTripsTogether
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your own credentials. Never commit your real `.env` file or API keys to GitHub.

Start the backend:

```bash
npm run dev
```

If you don't have a development script configured, use:

```bash
npm start
```

### 3. Configure the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

http://localhost:5173/

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Retrieve the authenticated user |

### Groups

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/groups` | Retrieve the user's groups |
| POST | `/api/groups` | Create a group |
| GET | `/api/groups/:id` | Retrieve a specific group |
| DELETE | `/api/groups/:id` | Delete a group |
| POST | `/api/groups/:id/members` | Add a group member |
| DELETE | `/api/groups/:id/members/:memberId` | Remove a member |
| GET | `/api/groups/:id/destinations` | Retrieve destination recommendations |

### AI Recommendations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/recommend` | Generate AI-powered trip recommendations |

Private endpoints require the appropriate authentication token. The AI endpoint expects trip information in the request body.

---

## 🚀 Deployment

TripSync is deployed on Render.

- **Live application:** https://tripsync-frontend-zc01.onrender.com/
- **Backend service:** Hosted on Render
- **Database:** MongoDB

The frontend communicates with the backend API, which handles authentication, group management, database operations, transportation estimates, and AI recommendations.

---

## 🔮 Future Improvements

- Live flight, train, and bus fare integrations
- Hotel booking API integration
- Interactive maps and distance-based calculations
- Collaborative itinerary editing
- Group expense splitting
- More personalized destination recommendations

---

## 👩‍💻 Project

**TripSync — Plan Trips Together**

A full-stack project focused on making group travel planning easier, more collaborative, and budget-conscious.

© 2026 TripSync
