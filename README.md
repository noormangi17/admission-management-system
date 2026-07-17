# Admission Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application built to streamline the student admission process. Students can register, apply for courses, upload required documents, and track their application status online, while administrators can manage courses, review applications, and approve or reject requests through a dedicated dashboard.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Live Demo

| Service | Link |
|---|---|
| Frontend | https://admission-management-system-chi.vercel.app |
| Backend API | https://admission-management-system-production-61f1.up.railway.app/ |

---

## Features

### Student Module
- User registration and secure login using JWT authentication
- Apply for admission to available courses
- Upload required documents
- View submitted applications and track status
- Download application as a PDF
- Update profile and manage account settings

### Admin Module
- Centralized admin dashboard
- Add, edit, and delete courses
- View all submitted applications
- Approve or reject applications
- View uploaded student documents
- Manage registered users

---

## Technologies Used

**Frontend**
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- JWT Authentication
- Multer (file uploads)
- PDFKit (PDF generation)

**Database**
- MongoDB Atlas
- Mongoose

**Deployment**
- Frontend: Vercel
- Backend: Railway

---

## Project Structure

```
admission-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
```

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/noormangi17/admission-management-system.git
cd admission-management-system
```

### 2. Set Up the Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Set Up the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | Retrieve all courses |
| POST | `/api/courses` | Create a new course |
| PUT | `/api/courses/:id` | Update a course by ID |
| DELETE | `/api/courses/:id` | Delete a course by ID |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Submit a new application |
| GET | `/api/applications` | Retrieve all applications (admin) |
| GET | `/api/applications/my` | Retrieve the logged-in user's applications |
| GET | `/api/applications/:id/pdf` | Download an application as a PDF |

---

## Future Improvements

- Email notifications for application status updates
- Payment gateway integration
- SMS alerts
- OTP-based verification
- Cloud storage integration for document uploads
- Advanced admin analytics dashboard

---

## Author

**Fateh Noor**
Computer Science Student, Sukkur IBA University
