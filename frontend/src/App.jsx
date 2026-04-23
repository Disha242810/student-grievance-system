import { useState } from "react";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Dashboard from "./Components/Dashboard.jsx";

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