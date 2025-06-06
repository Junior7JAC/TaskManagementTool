import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import type { Task } from "../types/Task";
import styles from "./TaskManager.module.css";

const TaskManager: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState<"day" | "week" | "month" | null>(null);

    useEffect(() => {
        getTasks(filter || undefined).then(setTasks);
    }, [filter]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !dueDate) return;

        if (editingTask) {
            // Check if the values are unchanged
            const dateOnly = editingTask.dueDate.split("T")[0];
            const titleUnchanged = title === editingTask.title;
            const dateUnchanged = dueDate === dateOnly;

            if (titleUnchanged && dateUnchanged) {
                alert("You must change the task title or due date before updating.");
                return;
            }

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
        const dateOnly = task.dueDate.split("T")[0];
        setDueDate(dateOnly);
        //setDueDate(task.dueDate);
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
                onCancelEdit={() => {
                    setEditingTask(null);
                    setTitle("");
                    setDueDate("");
                }}
            />

            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.filterButton} ${filter === null ? styles.activeFilter : ""}`}
                    onClick={() => setFilter(null)}
                >
                    All
                </button>
                <button
                    className={`${styles.filterButton} ${filter === "day" ? styles.activeFilter : ""}`}
                    onClick={() => setFilter("day")}
                >
                    Today
                </button>
                <button
                    className={`${styles.filterButton} ${filter === "week" ? styles.activeFilter : ""}`}
                    onClick={() => setFilter("week")}
                >
                    This Week
                </button>
                <button
                    className={`${styles.filterButton} ${filter === "month" ? styles.activeFilter : ""}`}
                    onClick={() => setFilter("month")}
                >
                    This Month
                </button>
            </div>


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
