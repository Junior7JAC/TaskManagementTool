import { useEffect, useState } from "react";
import { getTasks } from "./api/taskApi";

type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
  dueDate: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📋 Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <b>{task.title}</b> –{" "}
            {task.isCompleted ? "✅ Completed" : "❌ Pending"} (Due:{" "}
            {task.dueDate.split("T")[0]})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
