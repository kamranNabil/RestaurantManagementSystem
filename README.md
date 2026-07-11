# Restaurant Reservation Management System

A full-stack MERN application for managing restaurant table reservations with role-based access for customers and admins.

## Live Demo

- Frontend: https://restaurant-management-system-ten-navy.vercel.app
- Backend: https://restaurant-reservation-backend-ar12.onrender.com

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JWT

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB

### Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Seed the database with tables:

```bash
node seed.js
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Assumptions Made

- Single restaurant with 8 fixed tables
- Table capacities: 2, 2, 3, 4, 4, 5, 6, 6 seats
- Time slots are predefined from 12:00 PM to 9:00 PM in 1-hour intervals
- A reservation occupies a table for the entire time slot duration
- Admin accounts are created via the register page by selecting the Admin role

## Reservation & Availability Logic

When a customer books a table:
1. The system finds all tables already booked for the selected date and time slot
2. From the remaining available tables, it picks the first one with enough capacity for the number of guests
3. If no table is available, the booking is rejected with a clear error message

When an admin updates a reservation:
1. The system checks if the target table has enough capacity for the guests
2. It checks if the target table is already booked for the new date and time slot
3. If either check fails, the update is rejected with an appropriate error message

## Role-Based Access

### Customer
- Can register and login
- Can create reservations by selecting date, time slot, and number of guests
- Can view only their own reservations
- Can cancel only their own reservations

### Admin
- Has a visually distinct dark-themed dashboard
- Can view all reservations across all customers
- Can filter reservations by date
- Can update any reservation (shift to different table, date, or time slot)
- Can cancel any reservation
- Can view all restaurant tables and their status

JWT tokens carry the user role and all protected routes verify the token and role via middleware before allowing access.

## Known Limitations

- No email notifications on booking or cancellation
- No real-time updates (admin must refresh to see new bookings)
- Time slots are fixed and not configurable from the UI
- No pagination on the admin reservations list
- Render free tier spins down after inactivity, causing slow first load

## Areas for Improvement

- Add email confirmation on booking
- Real-time updates using WebSockets
- Allow admins to configure time slots and table setup from the UI
- Add pagination for large reservation lists
- Add a calendar view for better reservation visibility
- Implement refresh token mechanism for better auth security