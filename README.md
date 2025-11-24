# University Clearance System (UCS)

A comprehensive web-based platform designed to digitize and streamline the university graduation clearance process. This system connects **Students**, **Clearance Officers**, and **Administrators** in a unified interface to manage approvals, payments, and certificate generation efficiently.

---

## 🚀 Features

### 🎓 Student Portal
- Real-time dashboard to track clearance progress across all units (Library, Bursary, Hostel, Department, etc.)
- Integrated financial view for fees, fines, and simulated secure payments
- Secure document upload system
- Appointment booking with departmental officers
- Auto-generated, printable digital certificate (PDF) with QR verification

### 👮 Officer Portal
- Department-based digital queue for pending students
- Cross-check verification before final sign-off
- Approve/Reject workflow with mandatory comments
- Appointment management (accept/decline)
- Switch between departments easily

### 🛠️ Admin Portal
- Analytics dashboard with metrics on requests, approvals, and revenue
- Manage student, officer, and admin accounts
- Configure system-wide settings (registration status, maintenance mode)

---

## 🧑‍💻 Tech Stack

- **Frontend:** React 18  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS  
- **Icons:** Lucide React  
- **Language:** JavaScript (ES6+)  

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v16 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/naimcreates/WebProgramming-.git
cd UniClearace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open the application in your browser:  
**http://localhost:5173**

---

## 📖 Usage Guide

This is a **frontend-only prototype** using a simulation engine. No backend is required; all data is stored in browser memory during the session.

### 1. Switching Roles
Use the **Role Switcher** (top-right) to switch between:
- Student  
- Officer  
- Admin  

### 2. Testing Clearance Workflow

#### As Student
- Open Dashboard  
- Click **Pay Now** under Bursary  
- Click **Upload Proof** under Library  

#### As Officer
- Switch to Officer role  
- View Bursary to verify payment  
- View Library Services to check uploaded files  
- Approve/Reject with comments  

#### Back to Student
- Refresh dashboard to see updated statuses  

---

### 3. Printing Certificate
- Ensure all sections are **Approved**
- Navigate to **My Certificate**
- Click **Print**
- Page automatically formats for **A4 layout**

---

## 📂 Project Structure
```
university-clearance-system/
├── public/                # Static assets
├── src/
│   ├── App.jsx            # Main application logic
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind directives & global styles
├── index.html             # Base HTML file
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind configuration
└── vite.config.js         # Vite configuration
```

---
