import React, { useState } from "react";
import type { Task } from "../types/Task";
import styles from "./TaskForm.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  dueDate: string;
  setTitle: (title: string) => void;
  setDueDate: (date: string) => void;
  editingTask: Task | null;
  onCancelEdit?: () => void;
};

const TaskForm: React.FC<Props> = ({
  onSubmit,
  title,
  dueDate,
  setTitle,
  setDueDate,
  editingTask,
  onCancelEdit,
}) => {
  const [error, setError] = useState("");

  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    const selected = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (selected < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    setError(""); 
    onSubmit(e);
  };


  return (
    <form onSubmit={handleInternalSubmit} className={styles.form}>
      {editingTask && (
        <p style={{ color: "#ccc" }}>
          Editing task: <strong>{editingTask.title}</strong>
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />

      <DatePicker
        selected={dueDate ? new Date(dueDate) : null}
        onChange={(date) => {
          if (date) {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0];
            setDueDate(localDate);
          } else {
            setDueDate("");
          }
        }}
        placeholderText="dd-mm-yyyy"
        dateFormat="dd-MM-yyyy"
        className={styles.input}
        minDate={new Date()}
      />


      <div className={styles.buttonGroup}>
        <button type="submit" className={`${styles.button} ${styles.fullButton}`}>
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
