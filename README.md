# Restaurant Reservation Management System

<p align="left">
  <a href="https://restaurant-management-system-ten-navy.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-restaurant--management--system-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React_19_+_Vite_8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js_+_Express_5-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Express 5" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
</p>

A full-stack MERN application for booking and managing restaurant table reservations with capacity-based table allocation, conflict resolution, and role-based access control (RBAC) for customers and restaurant managers.

## ⚡ Key Highlights & Core Logic

- **Capacity-Optimized Table Allocation:** When a booking is submitted, the system checks occupied tables for the requested date and 1-hour time slot, automatically assigning the smallest available table that fits the party size.
- **Conflict Prevention & Update Validation:** Prevents double-booking across simultaneous slots. Admin shifts (modifying date, time, or table) undergo real-time capacity and collision checks before persisting.
- **Role-Based Authorization (RBAC):** Authenticated via JWT and password-hashed via `bcryptjs`. Distinct permissions isolate customer reservations while granting admins full management capabilities over all bookings and table assets.
- **Tailwind CSS v4 & React 19 Frontend:** High-performance, reactive client-side architecture styled with `@tailwindcss/vite` featuring distinct themes (light layout for customers, dark dashboard for admins).

## 🛠️ Tech Stack & Dependencies

### Frontend (`/Frontend`)

- **Core:** React 19, Vite 8, React Router DOM v7
- **Styling:** Tailwind CSS v4, `@tailwindcss/vite`
- **HTTP Client:** Axios

### Backend (`/Backend`)

- **Runtime & Framework:** Node.js (ES Modules), Express 5
- **Database & ODM:** MongoDB Atlas, Mongoose 9
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv
- **Development:** Nodemon

## 🍽️ System Configuration & Rules

| Parameter             | Configuration Detail                                      |
| :-------------------- | :-------------------------------------------------------- |
| **Restaurant Layout** | 8 Fixed Tables (Seeded via `seed.js`)                     |
| **Table Capacities**  | `2`, `2`, `3`, `4`, `4`, `5`, `6`, `6` seats              |
| **Time Slots**        | 1-Hour Fixed Intervals (12:00 PM – 9:00 PM)               |
| **Reservation Scope** | Occupies the entire allocated table for the 1-hour window |

## 👥 Role Permissions

```text
┌─────────────────────────────────────────────────────────────┐
│                    Customer Permissions                     │
├─────────────────────────────────────────────────────────────┤
│ • Register & Login with JWT session                         │
│ • Create reservations (Date, Time Slot, Party Size)         │
│ • View and cancel personal bookings                         │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Admin Permissions                      │
├─────────────────────────────────────────────────────────────┤
│ • Dedicated Dark-Themed Management Dashboard                │
│ • View all reservations with date filtering                 │
│ • Reassign reservations (modify table, date, or time slot)  │
│ • Cancel any reservation & view real-time table statuses    │
└─────────────────────────────────────────────────────────────┘
```
## ⚙️ Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/kamranNabil/RestaurantManagementSystem.git]
cd RestaurantManagementSystem
```

### 2. Backend Configuration (`/Backend`)
```bash
cd Backend
npm install
```

Create a `.env` file inside `/Backend`:
```bash
# .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Seed the default restaurant tables:
```bash
node seed.js
```

Start the backend API server:
```bash
npm run dev
```

### 3. Frontend Configuration (`/Frontend`)
Open a new terminal tab:
```bash
cd Frontend
npm install
npm run dev
```

> The application will run locally at **[http://localhost:5173]**.

## 📡 API Reference

| # | Method | Endpoint                    | Description                                   | Auth / Access |
|---|--------|-----------------------------|-----------------------------------------------|---------------|
| 1 | POST   | /api/auth/register          | Register a new user (Customer or Admin)       | Public        |
| 2 | POST   | /api/auth/login             | Authenticate user and issue JWT               | Public        |
| 3 | GET    | /api/reservations/my        | Fetch active user's bookings                  | Customer      |
| 4 | POST   | /api/reservations           | Book a table (Capacity & collision validated) | Customer      |
| 5 | DELETE | /api/reservations/:id       | Cancel a customer's own booking               | Customer      |
| 6 | GET    | /api/admin/reservations     | Fetch all bookings with date filters          | Admin Only    |
| 7 | PUT    | /api/admin/reservations/:id | Reassign table, time slot, or date            | Admin Only    |
| 8 | DELETE | /api/admin/reservations/:id | Cancel any booking                            | Admin Only    |
| 9 | GET    | /api/admin/tables           | Retrieve list of all restaurant tables        | Admin Only    |

---

## 📄 License

Distributed under the [ISC License](LICENSE).
```
