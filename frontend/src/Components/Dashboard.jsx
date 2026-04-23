import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://student-grievance-system-m73n.onrender.com/api";

function Dashboard({ setPage }) {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic"
  });
  const [hasSearched, setHasSearched] = useState(false);

  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: token }
  };

  // FETCH ALL
  const fetchData = async () => {
    const res = await axios.get(`${API}/grievances`, config);
    setGrievances(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/grievances`, form, config);
    fetchData();
  };

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`${API}/grievances/${id}`, config);
    fetchData();
  };

  // UPDATE STATUS
  const handleUpdate = async (id) => {
    await axios.put(`${API}/grievances/${id}`, { status: "Resolved" }, config);
    fetchData();
  };

  // SEARCH
  const handleSearch = async () => {
    setHasSearched(true);

    if (!search.trim()) {
        fetchData();
        return;
    }
    
    const res = await axios.get(
        `${API}/grievances/search?title=${search}`,
        config
    );
    
    setGrievances(res.data);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      {/* Submit Form */}
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />

        <select onChange={e => setForm({...form, category: e.target.value})}>
          <option>Academic</option>
          <option>Hostel</option>
          <option>Transport</option>
          <option>Other</option>
        </select>

        <button type="submit">Submit</button>
      </form>

      {/* Search */}
      <input placeholder="Search" onChange={e => setSearch(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <button onClick={fetchData}>Reset</button>

      {/* Display */}
      {grievances.length === 0 ? (
      <p className="no-records">No records found</p>
        ) : (
      <ul>
        {grievances.map(g => (
          <li key={g._id}>
            <div>
              <b>{g.title}</b>
              <span className={g.status === "Resolved" ? "resolved" : "pending"}>
                {g.status}
              </span>
            </div>

            <div>
              <button onClick={() => handleUpdate(g._id)}>Resolve</button>
              <button onClick={() => handleDelete(g._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    )}
    </div>
);
}

export default Dashboard;