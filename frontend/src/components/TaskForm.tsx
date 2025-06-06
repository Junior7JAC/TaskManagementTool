import React from "react";
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
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {editingTask && (
        <p style={{ color: "#ccc" }}>
          Editing task: <strong>{editingTask.title}</strong>
        </p>
      )}

      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
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
