import React from "react";
import type { Task } from "../types/Task";
import TaskItem from "./TaskItem";
import styles from "./TaskList.module.css"; 

type Props = {
  tasks: Task[];
  title: string;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

const TaskList: React.FC<Props> = ({ tasks, title, onToggle, onEdit, onDelete }) => {
  return (
    <div>
      <h2>{title}</h2>

      {tasks.length === 0 ? (
        <p className={styles.empty}>
          {title === "Pending Tasks"
            ? "No pending tasks yet."
            : "No completed tasks yet."}
        </p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
