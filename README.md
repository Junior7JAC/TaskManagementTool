# 📝 TaskManager App

A full-stack task management web application built with:

- 🧠 Backend: ASP.NET Core (C#), Entity Framework Core, SQLite
- 💻 Frontend: React + TypeScript (Vite), Context API
- 🎨 UI: CSS Modules with Light/Dark theme support
- 🔐 Auth: JWT-based login & role-based access control

---

## 🚀 Features

### 👤 Authentication
- Register/Login with JWT tokens
- Role-based access: Admins can view/manage all tasks, regular users only their own

### ✅ Task Management
- Add, edit, delete tasks with due dates
- Filter tasks by day/week/month
- Visual indicators for tasks due today
- Responsive design and theme toggle

---

## ⚙️ Setup Instructions

### 🔧 Backend (ASP.NET Core + SQLite)

1. Navigate to the backend folder:
    ```bash
   cd backend
2. Restore NuGet dependencies:
    ```bash
    dotnet restore
3. Apply EF Core migrations and initialize the database:
    ```bash
    dotnet ef database update
4. Run the backend server:
    ```bash
    dotnet run   
### 💻 Frontend (React + TypeScript + Vite)

1. Navigate to the frontend folder:
    ```bash
    cd frontend
2. Install frontend dependencies:
    ```bash
    npm install
3. Start the Vite development server:
    ```bash
    npm run dev
4. The frontend app will run at:
    ```bash
    http://localhost:5173
    