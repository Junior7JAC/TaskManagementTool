import axios from "axios";
import type { Task } from "../types/Task";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically add Authorization header to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET /tasks (optionally with ?filter=day|week|month)
export const getTasks = async (filter?: string) => {
  const res = await api.get("/tasks", {
    params: filter ? { filter } : {},
  });
  return res.data;
};

// POST /tasks
export const createTask = async (task: Partial<Task>) => {
  const res = await api.post("/tasks", task);
  return res.data;
};

// PUT /tasks/:id
export const updateTask = async (task: Task) => {
  const res = await api.put(`/tasks/${task.id}`, task);
  return res.data;
};

// DELETE /tasks/:id
export const deleteTask = async (id: number) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
