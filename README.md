# FOT Student Hub — Rajarata University

A role-based student portal + admin management system built for the **Faculty of Technology, Rajarata University of Sri Lanka**, developed as the Group 13 ("Innovate") academic project for ICT 2212.

---

## ✨ Features

- **OTP-based authentication** — email/password login, with OTP-verified registration and password reset (no plain-password registration).
- **Elections module** — students vote once per election (no per-position voting); results & candidate management for admins.
- **Announcements** — categorized notices with pinning and image support.
- **Complaints** — students submit complaints with images; admins triage, update status, and reply.
- **Lost & Found** — students report/browse lost or found items on campus.
- **Role-based Admin Panel** with five account types:
  | Role | Access |
  |---|---|
  | **Super Admin** | Full access — Users, Elections, Announcements, Complaints, Lost & Found, Activity Log, Registration Config |
  | **Hostel Warden** | Dashboard (scoped) + Announcements + Complaints only |
  | **Librarian** | Dashboard (scoped) + Announcements + Complaints only |
  | **Union Member** | Dashboard (scoped) + Announcements + Complaints only |
  | **Student** | Student Portal — Dashboard, Elections, Announcements, Complaints, Lost & Found, Notifications |

  No admin type (including Super Admin) is permitted to cast a vote in elections — voting is strictly student-only, enforced at the backend.
- **Temporary account blocking** — Super Admin can block a student's account for a set number of days with a reason; the reason is shown to the user on their next login attempt, and auto-lifts once the block period expires.
- **Global admin search** — instant, role-scoped search across users, announcements, complaints, elections, and lost & found from the admin topbar.
- **Student ↔ Admin portal switching** — any admin can jump into the read-only student view via the "Student Portal" button in the admin header.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (CRA) + React Router + Tailwind CSS + Framer Motion + lucide-react |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt, OTP via Nodemailer (SMTP) |
| File uploads | Multer |

---

## 📁 Folder Structure

```
fot-student-hub/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers (auth, admin, student, elections, regConfig)
│   ├── middleware/       # auth (JWT), role (RBAC), upload (multer)
│   ├── models/           # Mongoose schemas (User, Election, Complaint, Announcement, LostFound, OTP, ActivityLog, RegConfig)
│   ├── routes/            # Express routers
│   ├── uploads/            # Uploaded images (served at /uploads)
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/     # Shared UI (Sidebar, Layout, BrandMark, ImageLightbox, etc.)
        │   └── admin/       # AdminSidebar, AdminLayout
        ├── context/          # AuthContext, NotificationContext, ThemeContext
        ├── hooks/
        ├── pages/
        │   ├── student/       # Login, Register, Dashboard, Elections, VotingPage, Complaints, LostFound, Announcements, Profile
        │   └── admin/          # AdminDashboard, AdminUsers, AdminElections, AdminAnnouncements, AdminComplaints, AdminLostFound, AdminActivity, AdminProfile, RegistrationConfig
        ├── services/          # api.js — all Axios calls to the backend
        └── utils/
```

> **Scope note:** Only the Homepage, Election System, and Admin Dashboard are fully implemented end-to-end. Complaints, Lost & Found, and Announcements have working backend + frontend as well; Events remains a placeholder page (sidebar link + folder only, no backend).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- An SMTP account for sending OTP emails (Gmail App Password works well)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev             # starts with nodemon on http://localhost:5000
```

**`.env` variables:**

| Variable | Description |
|---|---|
| `PORT` | Port for the API server (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `NODE_ENV` | `development` or `production` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP server details |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials used to send OTP emails |

Optional: `npm run seed` to seed sample data, or `npm run seed:fresh` to wipe and reseed.

### 2. Frontend setup

```bash
cd frontend
npm install
npm start                # runs on http://localhost:3000, proxies API calls to :5000
```

### 3. Login

- Students register via **Register** (requires a `@student.fot.ruh.ac.lk` email, OTP-verified).
- Admin accounts (Super Admin / Hostel Warden / Librarian / Union Member) are created directly in the database or via the Super Admin's Users panel — there's no public admin sign-up form.
- After logging in, **admins land on `/admin`** (the Admin Dashboard) and **students land on `/dashboard`**.

---

## 🔐 Access Control Summary

- Every protected route requires a valid JWT (`middleware/auth.js`).
- University email domain (`@student.fot.ruh.ac.lk`) is enforced at registration.
- Admin-only routes are gated by `middleware/role.js`, which checks `adminType` per endpoint (`fullAccessOnly`, `canManageAnnouncements`, `canManageComplaints`, `canManageElections`, `canViewDashboard`).
- Voting is gated by `studentOnly` middleware — no admin type can vote, regardless of permissions elsewhere.
- Limited-staff admins (Hostel Warden / Librarian / Union Member) cannot see or reach the Elections section from either the Admin Panel or the Student Portal preview.

---

## 📦 Building for Production

```bash
cd frontend
npm run build     # outputs static build to frontend/build
```

Serve the `build` folder with your web server of choice, and point it at the deployed backend API.

---

## 👥 Team

**Group 13 — "Innovate"**
Faculty of Technology, Rajarata University of Sri Lanka — ICT 2212
