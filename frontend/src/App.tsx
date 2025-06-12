import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <h1>Task Manager</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskManager />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
