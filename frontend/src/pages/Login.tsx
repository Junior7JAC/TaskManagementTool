import React, { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";
import { Link } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Inside the component
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    try {
      await login(normalizedEmail, password);
      alert("Login success!");
      navigate("/tasks");

    } catch (err: any) {
      setError(
        err.response?.status === 401
          ? "Invalid email or password."
          : err.response?.data?.message || "Login failed."
      );
    }
  };



  return (
    <div className={styles.wrapper}>
      <div className={styles.pageSubtitle}>Login</div>
      <form onSubmit={handleSubmit} className={styles.container}>
        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className={styles.button} type="submit">Login</button>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.link}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
