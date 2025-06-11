import React, { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Inside the component
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // token already saved in authApi
      alert("Login success!");
      navigate("/"); // or "/tasks" or wherever you want to go after login
    } catch {
      setError("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
