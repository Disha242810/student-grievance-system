import { useState } from "react";
import axios from "axios";

const API = "https://student-grievance-system-m73n.onrender.com/api";

function Register({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/register`, form);
      alert("Registered Successfully");
      setPage("login");
    } catch (err) {
      alert(err.response?.data?.error || "Duplicate Email");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />

      <button type="submit">Register</button>

      <p onClick={() => setPage("login")}>Already have an account?</p>
    </form>
  );
}

export default Register;