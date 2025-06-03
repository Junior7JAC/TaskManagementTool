import { useEffect, useState } from "react";
import { getTasks, createTask } from "./api/taskApi";

type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
  dueDate: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    await createTask({
      title,
      dueDate,
      isCompleted: false,
    });

    setTitle("");
    setDueDate("");

    // Refresh task list
    const updated = await getTasks();
    setTasks(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📋 Task List</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

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
