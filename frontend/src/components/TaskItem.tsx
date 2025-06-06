import React from "react";
import type { Task } from "../types/Task";
import styles from "./TaskItem.module.css";

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}-${month}-${year}`;
};


const TaskItem: React.FC<Props> = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue =
    !task.isCompleted &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const isDueToday =
    !task.isCompleted &&
    new Date(task.dueDate).toDateString() === new Date().toDateString();


  return (
    <div className={styles.taskRow}>
      <label
        className={`${styles.label} ${isOverdue ? styles.overdue : ""} ${isDueToday ? styles.today : ""
          }`}
      >

        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task)}
        />{" "}
        {task.title} (Due: {formatDate(task.dueDate)})
      </label>
      <button className={styles.button} onClick={() => onEdit(task)}>
        Edit
      </button>
      <button className={styles.button} onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </div>
  );
};

export default TaskItem;
