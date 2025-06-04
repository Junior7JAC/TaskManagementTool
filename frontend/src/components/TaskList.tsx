import React from "react";
import type { Task } from "../types/Task";
import TaskItem from "./TaskItem";

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
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
