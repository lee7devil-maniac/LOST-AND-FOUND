# MCC Lost and Found Web Application

A complete production-ready full-stack web application designed exclusively for **Madras Christian College (MCC), Chennai**.

## 🚀 Features

- **Authentication System**: Secure register/login functionality with **MCC Email (@mcc.edu.in)** restriction.
- **Reporting System**: Post lost or found items with image uploads.
- **Search & Filters**: Find items quickly using search or category filters.
- **Responsive Dashboard**: Startup-level SaaS UI built with React & Tailwind CSS.
- **MCC Themed**: Elegant maroon and white design inspired by MCC colors.
- **Protected Routes**: Secure access to dashboard and reporting features.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Context API, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Security**: JWT Authentication, bcryptjs for password hashing.
- **File Handling**: Multer for local image uploads.

## 📦 Project Structure

```text
mcc-lost-found/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/      # API logic
│   ├── middleware/       # Auth, Upload, Error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── uploads/          # Local storage for images
│   ├── .env              # Environment variables
│   └── index.js          # Entry point
└── frontend/
    ├── src/
    │   ├── components/   # UI components (Navbar, Sidebar)
    │   ├── context/      # Auth state management
    │   ├── layouts/      # Application shells
    │   ├── pages/        # Main views (Dashboard, Report, Login)
    │   ├── services/     # Axios API instance
    │   └── App.jsx       # Routing
    ├── .env              # Environment variables
    └── tailwind.config.js # Theme configuration
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed on your system.
- MongoDB (Local or AtlasURI).

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm start  # Or "npm run dev" if nodemon is installed
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Deployment Steps (Antigravity Context)

1. **Connect to MongoDB**: Ensure the `MONGO_URI` in `backend/.env` is correct.
2. **Launch Backend**: Run the server in the backend terminal.
3. **Launch Frontend**: Run the dev server in the frontend terminal.
4. **Access**: Open `http://localhost:5173` in your browser.

## 🛠 GitHub Commands

```bash
git init
git add .
git commit -m "Initial commit: MCC Lost and Found App"
git remote add origin <your-repo-url>
git push -u origin main
```

---
**Prepared with ❤️ for MCCians.**
