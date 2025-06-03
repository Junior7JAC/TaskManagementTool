import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const getTasks = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTask = async (task: {
  title: string;
  isCompleted: boolean;
  dueDate: string;
}) => {
  const res = await axios.post(API_URL, task);
  return res.data;
};

export const updateTask = async (task: {
  id: number;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}) => {
  const res = await axios.put(`${API_URL}/${task.id}`, task);
  return res.data;
};

export const deleteTask = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
