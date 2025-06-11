import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/" element={<TaskManager />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
