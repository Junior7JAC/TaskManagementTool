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
