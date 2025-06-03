import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask } from "./api/taskApi";

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

            <h2>📋 Pending Tasks</h2>
            <ul>
                {tasks.filter((t) => !t.isCompleted).map((task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={async () => {
                                await updateTask({ ...task, isCompleted: !task.isCompleted });
                                const updated = await getTasks();
                                setTasks(updated);
                            }}
                            style={{ marginRight: 8 }}
                        />
                        <b>{task.title}</b> – ❌ Pending (Due: {task.dueDate.split("T")[0]})
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
                            onChange={async () => {
                                await updateTask({ ...task, isCompleted: !task.isCompleted });
                                const updated = await getTasks();
                                setTasks(updated);
                            }}
                            style={{ marginRight: 8 }}
                        />
                        <b style={{ textDecoration: "line-through" }}>{task.title}</b> – ✅ Completed (Due: {task.dueDate.split("T")[0]})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
