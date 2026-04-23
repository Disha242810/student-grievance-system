import { useState } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [page, setPage] = useState("login");

  const isLoggedIn = localStorage.getItem("token");

  if (isLoggedIn) {
    return <Dashboard setPage={setPage} />;
  }

  return (
    <div>
      {page === "login" ? (
        <Login setPage={setPage} />
      ) : (
        <Register setPage={setPage} />
      )}
    </div>
  );
}

export default App;