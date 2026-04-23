import { useState } from "react";
import axios from "axios";

const API = "https://student-grievance-system-m73n.onrender.com/api";

function Login({ setPage }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/login`, form);
      localStorage.setItem("token", res.data.token);
      window.location.reload();
    } catch (err) {
      alert("Invalid Login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />

      <button type="submit">Login</button>

      <p onClick={() => setPage("register")}>Create account</p>
    </form>
  );
}

export default Login;