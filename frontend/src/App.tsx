import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api/taskApi";

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
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    if (editingTask) {
      await updateTask({
        id: editingTask.id,
        title,
        dueDate,
        isCompleted: editingTask.isCompleted,
      });
    } else {
      await createTask({
        title,
        dueDate,
        isCompleted: false,
      });
    }

    setTitle("");
    setDueDate("");
    setEditingTask(null);
    const updated = await getTasks();
    setTasks(updated);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    await deleteTask(id);
    const updated = await getTasks();
    setTasks(updated);
  };

  const toggleCompletion = async (task: Task) => {
    await updateTask({ ...task, isCompleted: !task.isCompleted });
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
        <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
        {editingTask && (
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setTitle("");
              setDueDate("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>📋 Pending Tasks</h2>
      <ul>
        {tasks.filter((t) => !t.isCompleted).map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleCompletion(task)}
              style={{ marginRight: 8 }}
            />
            <b>{task.title}</b> – ❌ Pending (Due: {task.dueDate.split("T")[0]})
            <button
              onClick={() => {
                setEditingTask(task);
                setTitle(task.title);
                setDueDate(task.dueDate.split("T")[0]);
              }}
              style={{ marginLeft: 8 }}
            >
              ✏️ Edit
            </button>
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: 4 }}>
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: "2rem" }}>✅ Completed Tasks</h2>
      <ul>
        {tasks.filter((t) => t.isCompleted).map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleCompletion(task)}
              style={{ marginRight: 8 }}
            />
            <b style={{ textDecoration: "line-through" }}>{task.title}</b> – ✅ Completed (Due: {task.dueDate.split("T")[0]})
            <button
              onClick={() => {
                setEditingTask(task);
                setTitle(task.title);
                setDueDate(task.dueDate.split("T")[0]);
              }}
              style={{ marginLeft: 8 }}
            >
              ✏️ Edit
            </button>
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: 4 }}>
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
