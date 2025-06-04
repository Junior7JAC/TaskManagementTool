import React from "react";
import type { Task } from "../types/Task";
import styles from "./TaskForm.module.css";

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  dueDate: string;
  setTitle: (title: string) => void;
  setDueDate: (date: string) => void;
  editingTask: Task | null;
};

const TaskForm: React.FC<Props> = ({
  onSubmit,
  title,
  dueDate,
  setTitle,
  setDueDate,
  editingTask,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
      />
      <input
        className={styles.input}
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit" className={styles.button}>
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
