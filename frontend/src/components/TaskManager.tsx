import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import type { Task } from "../types/Task";

const TaskManager: React.FC = () => {
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
            setEditingTask(null);
        } else {
            await createTask({ title, dueDate, isCompleted: false });
        }

        const updated = await getTasks();
        setTasks(updated);
        setTitle("");
        setDueDate("");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        await deleteTask(id);
        const updated = await getTasks();
        setTasks(updated);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDueDate(task.dueDate);
    };

    const handleToggle = async (task: Task) => {
        await updateTask({ ...task, isCompleted: !task.isCompleted });
        const updated = await getTasks();
        setTasks(updated);
    };

    return (
        <div>
            <TaskForm
                onSubmit={handleSubmit}
                title={title}
                dueDate={dueDate}
                setTitle={setTitle}
                setDueDate={setDueDate}
                editingTask={editingTask}
            />

            <TaskList
                tasks={tasks.filter((t) => !t.isCompleted)}
                title="Pending Tasks"
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <TaskList
                tasks={tasks.filter((t) => t.isCompleted)}
                title="Completed Tasks"
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default TaskManager;
