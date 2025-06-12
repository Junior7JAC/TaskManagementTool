import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import type { Task } from "../types/Task";
import styles from "./TaskManager.module.css";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const TaskManager: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState<"day" | "week" | "month" | null>(null);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getTasks(filter || undefined).then((data) => {
            setTasks(data);
            setIsLoading(false);
        });
    }, [filter]);

    useEffect(() => {
        setIsLoading(true);
        getTasks(filter || undefined)
            .then((data) => {
                setTasks(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    console.error("Failed to fetch tasks:", error);
                }
            });
    }, [filter]);


    const showMessage = (msg: string) => {
        setFeedback(msg);
        requestAnimationFrame(() => {
            setTimeout(() => {
                setFeedback("");
            }, 2000);
        });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !dueDate) return;

        if (editingTask) {
            const dateOnly = editingTask.dueDate.split("T")[0];
            const unchanged = title === editingTask.title && dueDate === dateOnly;

            if (unchanged) {
                alert("You must change the task title or due date before updating.");
                return;
            }

            await updateTask({
                id: editingTask.id,
                title,
                dueDate,
                isCompleted: editingTask.isCompleted,
            });
            showMessage("Task updated!");
            setEditingTask(null);
        } else {
            await createTask({ title, dueDate, isCompleted: false });
            showMessage("Task added!");
        }

        const updated = await getTasks(filter || undefined);
        setTasks(updated);
        setTitle("");
        setDueDate("");
    };



    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        await deleteTask(id);
        showMessage("Task deleted!");
        const updated = await getTasks(filter || undefined);
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

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;

        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <div className={styles.taskManager}>
            <div className={styles.themeWrapper}>
                <ThemeToggle />
            </div>

            <div className={styles.logoutWrapper}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>


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

            {isLoading && (
                <div className={styles.spinner}></div>
            )}

            {feedback && <p className={styles.feedback}>{feedback}</p>}


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
                tasks={tasks.filter((t) => !t.isCompleted)
                    .sort((a, b) => {
                        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                        return aDate - bDate;
                    })
                }
                title="Pending Tasks"
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <TaskList
                tasks={tasks.filter((t) => t.isCompleted)
                    .sort((a, b) => {
                        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity;
                        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity;
                        return bDate - aDate;
                    })
                }
                title="Completed Tasks"
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default TaskManager;
