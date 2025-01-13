# 🐟 Fisheries Management Dashboard

## Overview

The Fisheries Management Dashboard is a comprehensive web application designed to streamline fisheries data management, monitoring, and analysis. This powerful tool enables administrators to track water quality, monitor disease outbreaks, and manage performance metrics efficiently.

## 🌟 Key Features

- User Authentication (Admin and User Roles)
- Water Quality Monitoring
- Disease Outbreak Tracking
- Real-Time Performance Metrics
- Responsive and Intuitive UI
- Secure Route Protection

## 🔐 User Roles

### Admin
- Full system access
- Dashboard management
- Water Quality tracking
- Disease Outbreak monitoring
- Performance Metrics analysis

### User
- Limited access
- Profile management

## 🚦 Available Routes

### Public Routes
- `/login` - User Login
- `/` - User Registration

### Admin Protected Routes
- `/dashboard` - Admin Dashboard
- `/water-quality` - Water Quality Dashboard
- `/add-water-quality` - Add Water Quality Reading
- `/disease-outbreak` - Disease Outbreak Dashboard
- `/add-disease-outbreak` - Add Disease Outbreak Report
- `/performance-metrics` - System Performance Dashboard

### User Protected Routes
- `/profile` - User Profile

## 🛠 Technology Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Shadcn UI
- Chart.js

### Backend & Database
- Firebase Authentication
- Firebase Realtime Database
- Firebase Firestore

### State Management
- React Context API

### Additional Libraries
- React Toastify
- Lucide React Icons

## 📦 Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Firebase Account

## 🚀 Installation

1. Clone the repository
```bash
git clone https://github.com/JatinGera27aug/Fisheries.git
 
 -- leave below step if already in frontend folder 

cd frontend  

npm install

npm install firebase shadcn-ui axios react-router-dom bootstrap

npm install -D tailwindcss postcss autoprefixer

Now, Set up Firebase Configuration
Create a .env file in the project root

Add the following Firebase configuration variables:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

npm run dev



🤝 Contributing
Fork the repository
Create a new branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
🐛 Reporting Issues
Report issues on the GitHub Issues page.

📄 License
Distributed under the MIT License. See LICENSE for more information.