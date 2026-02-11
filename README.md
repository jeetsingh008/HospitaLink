# Hospital Appointment Booking System

A full-stack (MERN) hospital appointment booking application that allows patients to book appointments with doctors, and admins to manage the system.

## 🚀 Features

-   **Role-Based Authentication**: Secure login and registration for Patients, Doctors, and Admins.
-   **Patient Portal**:
    -   View available doctors.
    -   Book appointments.
    -   Manage booked appointments.
-   **Doctor Portal**:
    -   View upcoming appointments.
    -   Manage availability/slots.
-   **Admin Dashboard**:
    -   Add new doctors.
    -   Manage all appointments and users.
    -   System overview.

## 🛠️ Tech Stack

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (with Mongoose)
-   **Authentication**: JWT (JSON Web Tokens) with Access & Refresh tokens
-   **Security**: Bcrypt (password hashing), CORS, Cookie-Parser

### Frontend
-   **Framework**: React (Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State/Data Fetching**: React Query (@tanstack/react-query), Axios
-   **Routing**: React Router DOM
-   **Icons**: Lucide React

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16+ recommended)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd appointment_booking_app
```

### 2. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<your-connection-string> # or mongodb://localhost:27017
CORS_ORIGIN=http://localhost:5173 # Adjust based on frontend URL
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
```

**Seed Database (Create Admin)**
Run the seed script to create the initial Admin account:
```bash
npm run seed
```
_This will create an admin user with credentials: `admin` / `admin123`_

**Start the Server:**
```bash
npm run dev
```
The backend server will start at `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory, and install dependencies:
```bash
cd ../frontend
npm install
```

**Environment Variables:**
Create a `.env` file in the `frontend` directory (optional if using defaults):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

**Start the Client:**
```bash
npm run dev
```
The frontend application will start at `http://localhost:5173` (or the port shown in terminal).

## 🔑 Default Credentials

**Admin Account** (Created via `npm run seed`):
-   **Username**: `admin`
-   **Password**: `admin123`

## 📂 Project Structure

```
appointment_booking_app/
├── backend/                # Express server and API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth and error handling components
│   │   └── ...
│   └── package.json
│
├── frontend/               # React client application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Patient, Doctor, Admin)
│   │   ├── context/        # React Context (Auth)
│   │   └── ...
│   └── package.json
│
└── README.md               # Project documentation
```

## 📝 API Endpoints

### Authentication
-   `POST /api/v1/auth/register` - Register a new user
-   `POST /api/v1/auth/login` - Login user
-   `POST /api/v1/auth/logout` - Logout user
-   `POST /api/v1/auth/refresh-token` - Refresh access token

### Patients
-   `GET /api/v1/patients/appointments` - Get patient appointments
-   `POST /api/v1/patients/book-appointment` - Book a new appointment

### Doctors
-   `GET /api/v1/doctors/appointments` - Get doctor appointments
-   `GET /api/v1/doctors/slots` - Get available slots

### Admin
-   `POST /api/v1/admin/add-doctor` - Add a new doctor
-   `GET /api/v1/admin/users` - Get all users
-   `GET /api/v1/admin/appointments` - Get all appointments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
